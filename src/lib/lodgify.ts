import * as ical from "node-ical";
import { NormalizedBooking } from "@/src/types";
import {
  calculateNightsRemaining,
  isSameCalendarDay,
  parseCheckoutDateTime,
  resolveTimezone
} from "@/src/lib/dates";
import { cleanWhitespace, toTitleCase } from "@/src/lib/formatters";

// ─── Lodgify API (https://docs.lodgify.com/reference/reservations) ───

const LODGIFY_API_BASE = "https://api.lodgify.com/v1";

/** Lodgify API reservation item (guest, arrival, departure). API may use snake_case or camelCase. */
type LodgifyReservationItem = {
  arrival?: string;
  departure?: string;
  status?: string;
  guest?: {
    first_name?: string;
    last_name?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
  };
  [key: string]: unknown;
};

/** Response may be { data: [] }, { items: [] }, or { reservations: [] }. */
type LodgifyReservationsResponse = {
  data?: LodgifyReservationItem[];
  items?: LodgifyReservationItem[];
  reservations?: LodgifyReservationItem[];
};

const BLOCKED_STATUSES = ["blocked", "Blocked", "declined", "Declined", "cancelled", "Cancelled", "owner", "Owner"];

function parseLodgifyDate(value: string | undefined): Date | null {
  if (!value || typeof value !== "string") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function guestFirstNameFromApi(reservation: LodgifyReservationItem): string | null {
  const r = reservation as Record<string, unknown>;

  const fromGuest = (g: unknown): string | null => {
    if (!g || typeof g !== "object") return null;
    const o = g as Record<string, unknown>;
    const first =
      (o.first_name as string) ??
      (o.firstName as string) ??
      (typeof o.name === "string" ? o.name.split(/\s+/)[0] : null);
    const trimmed = typeof first === "string" ? first.trim() : null;
    return trimmed && trimmed.length > 0 ? toTitleCase(trimmed) : null;
  };

  const fromNameString = (name: unknown): string | null => {
    const s = typeof name === "string" ? name.trim() : null;
    if (!s) return null;
    const first = s.split(/\s+/)[0];
    return first && first.length > 0 ? toTitleCase(first) : null;
  };

  return (
    fromGuest(reservation.guest) ??
    fromGuest(r.primary_guest) ??
    fromGuest(Array.isArray(r.guests) ? r.guests[0] : null) ??
    fromNameString(r.guest_name ?? r.guestName ?? r.contact_name ?? r.name)
  );
}

export async function getActiveBookingFromApi(
  propertyId: number,
  apiKey: string,
  checkoutTime: string,
  timezone?: string,
  now = new Date()
): Promise<NormalizedBooking> {
  const tz = resolveTimezone(timezone);

  try {
    const url = new URL(`${LODGIFY_API_BASE}/reservation/reservations`);
    url.searchParams.set("property_id", String(propertyId));

    const response = await fetch(url.toString(), {
      headers: {
        "X-ApiKey": apiKey,
        Accept: "application/json"
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`Lodgify API failed with status ${response.status}`);
    }

    const body = (await response.json()) as LodgifyReservationsResponse | LodgifyReservationItem[];
    // Log raw response shape to Vercel function logs so we can see exact field names
    console.log("[Lodgify API] raw response keys:", JSON.stringify(Object.keys(body as object)));
    console.log("[Lodgify API] raw body:", JSON.stringify(body).slice(0, 2000));
    const list = Array.isArray(body)
      ? body
      : (body.data ?? body.items ?? body.reservations ?? []);

    if (!Array.isArray(list) || list.length === 0) {
      return buildEmptyBooking();
    }

    const nowTime = now.getTime();
    const active = list
      .filter((r) => {
        const status = (r.status ?? "").toString();
        if (BLOCKED_STATUSES.some((s) => status.toLowerCase().includes(s.toLowerCase()))) return false;
        const arrival = parseLodgifyDate(r.arrival);
        const departure = parseLodgifyDate(r.departure);
        if (!arrival || !departure) return false;
        return nowTime >= arrival.getTime() && nowTime < departure.getTime();
      })
      .sort((a, b) => {
        const depA = parseLodgifyDate(a.departure)?.getTime() ?? 0;
        const depB = parseLodgifyDate(b.departure)?.getTime() ?? 0;
        return depB - depA;
      })[0];

    if (!active) {
      return buildEmptyBooking();
    }

    const arrival = parseLodgifyDate(active.arrival);
    const departure = parseLodgifyDate(active.departure);
    if (!arrival || !departure) {
      return buildEmptyBooking();
    }

    const guestFirstName = guestFirstNameFromApi(active);
    console.log("[Lodgify API] active reservation keys:", JSON.stringify(Object.keys(active)));
    console.log("[Lodgify API] active.guest:", JSON.stringify(active.guest));
    console.log("[Lodgify API] resolved guestFirstName:", guestFirstName);
    return toNormalizedBooking(arrival, departure, guestFirstName, checkoutTime, tz, now);
  } catch (error) {
    console.error("Lodgify API reservation fetch failed", error);
    return buildEmptyBooking();
  }
}

type ParsedEvent = {
  start: Date;
  end: Date;
  summary: string;
  description: string;
  status: string;
};

type RawIcalEvent = {
  type?: string;
  start?: Date | string;
  end?: Date | string;
  summary?: string;
  description?: string;
  status?: string;
};

const PLATFORM_WORDS = [
  "airbnb",
  "booking",
  "expedia",
  "vrbo",
  "reserved",
  "reservation",
  "guest",
  "blocked",
  "owner",
  "stay",
  "check-in",
  "check-out"
];

function buildEmptyBooking(): NormalizedBooking {
  return {
    isOccupied: false,
    guestFirstName: null,
    checkIn: null,
    checkOut: null,
    nightsRemaining: 0,
    isCheckoutDay: false,
    checkoutHasPassed: false
  };
}

function looksLikeBlockedEvent(summary: string, description: string, status: string): boolean {
  const haystack = `${summary} ${description} ${status}`.toLowerCase();
  return (
    haystack.includes("blocked") ||
    haystack.includes("owner") ||
    haystack.includes("hold") ||
    haystack.includes("maintenance") ||
    haystack.includes("cancel")
  );
}

function extractFirstName(summary: string, description: string): string | null {
  const raw = cleanWhitespace(`${summary} ${description}`);
  if (!raw) {
    return null;
  }

  const regexMatchers = [
    /guest\s*[:\-]\s*([a-zA-Z][a-zA-Z\-']+(?:\s+[a-zA-Z][a-zA-Z\-']+){0,2})/i,
    /(?:reserved|reservation|booked|booking)\s*(?:for|by)?\s*[:\-]?\s*([a-zA-Z][a-zA-Z\-']+(?:\s+[a-zA-Z][a-zA-Z\-']+){0,2})/i,
    /^([a-zA-Z][a-zA-Z\-']+(?:\s+[a-zA-Z][a-zA-Z\-']+){0,2})\s*(?:-|\||,)/i
  ];

  for (const regex of regexMatchers) {
    const match = raw.match(regex);
    if (match?.[1]) {
      const first = match[1].split(" ")[0]?.trim();
      if (first && first.length > 1) {
        return toTitleCase(first);
      }
    }
  }

  const tokens = raw
    .split(/[^a-zA-Z\-']+/)
    .filter((token) => token.length > 1)
    .filter((token) => !PLATFORM_WORDS.includes(token.toLowerCase()));

  if (!tokens.length) {
    return null;
  }

  const maybeName = tokens.find((token) => /^[A-Za-z][A-Za-z\-']+$/.test(token));
  return maybeName ? toTitleCase(maybeName) : null;
}

function normalizeEvents(icalPayload: Record<string, unknown>): ParsedEvent[] {
  return Object.values(icalPayload)
    .filter((entry): entry is RawIcalEvent => Boolean(entry) && typeof entry === "object")
    .filter((entry) => entry.type === "VEVENT")
    .map((entry) => {
      const start = entry.start ? new Date(entry.start) : null;
      const end = entry.end ? new Date(entry.end) : null;

      if (!(start instanceof Date) || Number.isNaN(start.getTime()) || !(end instanceof Date) || Number.isNaN(end.getTime())) {
        return null;
      }

      return {
        start,
        end,
        summary: cleanWhitespace(entry.summary || ""),
        description: cleanWhitespace(entry.description || ""),
        status: cleanWhitespace(entry.status || "")
      };
    })
    .filter((event): event is ParsedEvent => Boolean(event));
}

function toNormalizedBooking(
  checkIn: Date,
  checkOut: Date,
  guestFirstName: string | null,
  checkoutTime: string,
  timezone: string,
  now: Date
): NormalizedBooking {
  const checkoutDeadline = parseCheckoutDateTime(checkOut, checkoutTime, timezone);
  const isCheckoutDay = isSameCalendarDay(checkOut, now, timezone);

  return {
    isOccupied: true,
    guestFirstName,
    checkIn,
    checkOut,
    nightsRemaining: calculateNightsRemaining(checkOut, now, timezone),
    isCheckoutDay,
    checkoutHasPassed: isCheckoutDay && now >= checkoutDeadline
  };
}

export async function getActiveBookingFromIcal(
  icalUrl: string,
  checkoutTime: string,
  timezone?: string,
  now = new Date()
): Promise<NormalizedBooking> {
  if (!icalUrl) {
    return buildEmptyBooking();
  }

  const tz = resolveTimezone(timezone);

  try {
    const response = await fetch(icalUrl, { next: { revalidate: 300 } });
    if (!response.ok) {
      throw new Error(`iCal fetch failed with status ${response.status}`);
    }

    const rawIcal = await response.text();
    const parsed = ical.sync.parseICS(rawIcal) as Record<string, unknown>;
    const events = normalizeEvents(parsed);

    const activeEvents = events
      .filter((event) => now >= event.start && now < event.end)
      .filter((event) => !looksLikeBlockedEvent(event.summary, event.description, event.status))
      .sort((a, b) => b.start.getTime() - a.start.getTime());

    const active = activeEvents[0];
    if (!active) {
      return buildEmptyBooking();
    }

    const guestFirstName = extractFirstName(active.summary, active.description);

    return toNormalizedBooking(active.start, active.end, guestFirstName, checkoutTime, tz, now);
  } catch (error) {
    console.error("Lodgify iCal parsing failed", error);
    return buildEmptyBooking();
  }
}

export function normalizeMockBooking(
  booking: NormalizedBooking | undefined,
  checkoutTime: string,
  timezone?: string,
  now = new Date()
): NormalizedBooking {
  if (!booking?.isOccupied || !booking.checkIn || !booking.checkOut) {
    return buildEmptyBooking();
  }

  return toNormalizedBooking(
    booking.checkIn,
    booking.checkOut,
    booking.guestFirstName,
    checkoutTime,
    resolveTimezone(timezone),
    now
  );
}
