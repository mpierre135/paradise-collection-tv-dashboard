import * as ical from "node-ical";
import { NormalizedBooking } from "@/src/types";
import {
  calculateNightsRemaining,
  isSameCalendarDay,
  parseCheckoutDateTime,
  resolveTimezone
} from "@/src/lib/dates";
import { cleanWhitespace, toTitleCase } from "@/src/lib/formatters";

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
