import { differenceInCalendarDays } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

const DEFAULT_TIMEZONE = "America/New_York";

export function resolveTimezone(timezone?: string): string {
  return timezone || DEFAULT_TIMEZONE;
}

export function formatDateForDisplay(date: Date, timezone?: string): string {
  return formatInTimeZone(date, resolveTimezone(timezone), "EEE, MMM d");
}

export function formatDateTimeForDisplay(date: Date, timezone?: string): string {
  return formatInTimeZone(date, resolveTimezone(timezone), "EEE, MMM d 'at' h:mm a");
}

export function formatClock(date: Date, timezone?: string): string {
  return formatInTimeZone(date, resolveTimezone(timezone), "h:mm a");
}

export function formatTodayLabel(date: Date, timezone?: string): string {
  return formatInTimeZone(date, resolveTimezone(timezone), "EEEE, MMMM d");
}

export function parseCheckoutDateTime(checkOut: Date, checkoutTime: string, timezone?: string): Date {
  const tz = resolveTimezone(timezone);
  const [hoursRaw, minutesRaw] = checkoutTime.split(":");
  const hours = Number.parseInt(hoursRaw, 10);
  const minutes = Number.parseInt(minutesRaw ?? "0", 10);

  const datePart = formatInTimeZone(checkOut, tz, "yyyy-MM-dd");
  const hh = Number.isFinite(hours) ? String(hours).padStart(2, "0") : "11";
  const mm = Number.isFinite(minutes) ? String(minutes).padStart(2, "0") : "00";

  return fromZonedTime(`${datePart}T${hh}:${mm}:00`, tz);
}

export function isSameCalendarDay(dateA: Date, dateB: Date, timezone?: string): boolean {
  const tz = resolveTimezone(timezone);
  return formatInTimeZone(dateA, tz, "yyyy-MM-dd") === formatInTimeZone(dateB, tz, "yyyy-MM-dd");
}

export function calculateNightsRemaining(checkOut: Date, now: Date, timezone?: string): number {
  const tz = resolveTimezone(timezone);
  const zonedCheckOut = toZonedTime(checkOut, tz);
  const zonedNow = toZonedTime(now, tz);
  return Math.max(0, differenceInCalendarDays(zonedCheckOut, zonedNow));
}

export function formatStayRange(checkIn: Date, checkOut: Date, timezone?: string): string {
  return `${formatDateForDisplay(checkIn, timezone)} - ${formatDateForDisplay(checkOut, timezone)}`;
}

export function formatCountdown(target: Date, now: Date): string {
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) {
    return "0m remaining";
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `${minutes}m remaining`;
  }

  return `${hours}h ${minutes}m remaining`;
}

export function isoNow(): string {
  return new Date().toISOString();
}
