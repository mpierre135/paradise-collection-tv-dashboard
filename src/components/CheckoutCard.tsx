"use client";

import { useEffect, useMemo, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { formatCountdown, parseCheckoutDateTime } from "@/src/lib/dates";

type CheckoutCardProps = {
  isOccupied: boolean;
  checkOutIso: string | null;
  checkoutTime: string;
  timezone: string;
  nightsRemaining: number;
};

export function CheckoutCard({
  isOccupied,
  checkOutIso,
  checkoutTime,
  timezone,
  nightsRemaining
}: CheckoutCardProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const content = useMemo(() => {
    if (!isOccupied || !checkOutIso) {
      return {
        title: "Checkout",
        body: "No active stay",
        helper: ""
      };
    }

    const checkOutDate = new Date(checkOutIso);
    const checkoutDeadline = parseCheckoutDateTime(checkOutDate, checkoutTime, timezone);

    const checkoutDayKey = formatInTimeZone(checkOutDate, timezone, "yyyy-MM-dd");
    const nowDayKey = formatInTimeZone(now, timezone, "yyyy-MM-dd");
    const isCheckoutDay = checkoutDayKey === nowDayKey;

    if (isCheckoutDay && now < checkoutDeadline) {
      return {
        title: `Checkout Today at ${formatInTimeZone(checkoutDeadline, timezone, "h:mm a")}`,
        body: formatCountdown(checkoutDeadline, now),
        helper: "Need extra time? Ask the host using the late checkout card."
      };
    }

    if (isCheckoutDay && now >= checkoutDeadline) {
      return {
        title: "Safe travels",
        body: "Thank you for staying with The Paradise Collection",
        helper: "We hope to welcome you back soon."
      };
    }

    return {
      title: `Checkout ${formatInTimeZone(checkOutDate, timezone, "EEE, MMM d")}`,
      body: `You have ${nightsRemaining} ${nightsRemaining === 1 ? "night" : "nights"} remaining`,
      helper: "Enjoy your stay."
    };
  }, [isOccupied, checkOutIso, checkoutTime, timezone, now, nightsRemaining]);

  return (
    <section className="tv-card">
      <p className="tv-kicker">Departure</p>
      <h3 className="tv-title">{content.title}</h3>
      <p className="mt-6 text-4xl font-semibold text-white">{content.body}</p>
      {content.helper ? <p className="mt-4 text-xl text-white/80">{content.helper}</p> : null}
    </section>
  );
}
