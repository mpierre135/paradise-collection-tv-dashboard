"use client";

import { useEffect, useMemo, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";

type ClockDisplayProps = {
  timezone: string;
};

export function ClockDisplay({ timezone }: ClockDisplayProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatted = useMemo(
    () => ({
      day: formatInTimeZone(now, timezone, "EEEE, MMMM d"),
      time: formatInTimeZone(now, timezone, "h:mm:ss a")
    }),
    [now, timezone]
  );

  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-right shadow-glow backdrop-blur-md">
      <p className="text-sm uppercase tracking-[0.2em] text-white/70">Local Time</p>
      <p className="mt-1 text-4xl font-semibold text-white">{formatted.time}</p>
      <p className="text-lg text-white/85">{formatted.day}</p>
    </div>
  );
}
