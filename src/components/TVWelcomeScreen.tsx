"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { UnitConfig, WeatherSnapshot, Upsell, Recommendation } from "@/src/types";
import { ClockDisplay } from "@/src/components/ClockDisplay";
import { WeatherCard } from "@/src/components/WeatherCard";
import { CheckoutCard } from "@/src/components/CheckoutCard";
import { WifiGuideCard } from "@/src/components/WifiGuideCard";
import { UpsellsPanel } from "@/src/components/UpsellsPanel";
import { RecommendationsPanel } from "@/src/components/RecommendationsPanel";
import { formatStayRange } from "@/src/lib/dates";

const REFRESH_INTERVAL_MS = 15 * 60 * 1000;

type BookingViewModel = {
  isOccupied: boolean;
  guestFirstName: string | null;
  checkInIso: string | null;
  checkOutIso: string | null;
  nightsRemaining: number;
};

type TVWelcomeScreenProps = {
  unit: UnitConfig;
  booking: BookingViewModel;
  weather: WeatherSnapshot | null;
  upsells: Upsell[];
  recommendations: Recommendation[];
  qr: {
    wifi: string | null;
    guide: string | null;
    upsellById: Record<string, string | null>;
  };
};

export function TVWelcomeScreen({
  unit,
  booking,
  weather,
  upsells,
  recommendations,
  qr
}: TVWelcomeScreenProps) {
  const [mountedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const refresh = setInterval(() => {
      window.location.reload();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(refresh);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  const refreshCountdown = useMemo(() => {
    const remaining = Math.max(0, REFRESH_INTERVAL_MS - (now - mountedAt));
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [mountedAt, now]);

  const stayRange =
    booking.checkInIso && booking.checkOutIso
      ? formatStayRange(new Date(booking.checkInIso), new Date(booking.checkOutIso), unit.timezone)
      : null;

  return (
    <main className="tv-safe relative min-h-screen overflow-hidden p-6 text-white md:p-10 lg:p-12">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${unit.theme.backgroundImageUrl})` }}
        aria-hidden
      />
      <div className="absolute inset-0" style={{ background: unit.theme.overlayGradient }} aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_36%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.16),transparent_30%)]" aria-hidden />

      <div className="relative mx-auto flex h-full max-w-[1850px] flex-col gap-6">
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid items-start gap-6 xl:grid-cols-[1fr_auto]"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/75">The Paradise Collection</p>
            <h1 className="mt-2 font-display text-6xl leading-tight text-white xl:text-7xl">Welcome to {unit.propertyName}</h1>
            <p className="mt-3 text-4xl text-white/95 xl:text-5xl">
              {booking.guestFirstName ? `Welcome, ${booking.guestFirstName}` : "Welcome to Paradise"}
            </p>
            {stayRange ? <p className="mt-3 text-2xl text-white/82">Your stay: {stayRange}</p> : null}
          </div>
          <ClockDisplay timezone={unit.timezone} />
        </motion.header>

        <div className="grid flex-1 gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <WeatherCard weather={weather} city={unit.city} />
              <CheckoutCard
                isOccupied={booking.isOccupied}
                checkOutIso={booking.checkOutIso}
                checkoutTime={unit.checkoutTime}
                timezone={unit.timezone}
                nightsRemaining={booking.nightsRemaining}
              />
            </div>

            <UpsellsPanel upsells={upsells} qrById={qr.upsellById} />
            <RecommendationsPanel recommendations={recommendations} />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="flex h-full flex-col gap-6"
          >
            <WifiGuideCard unit={unit} wifiQrDataUrl={qr.wifi} guideQrDataUrl={qr.guide} />

            <div className="tv-card">
              <p className="tv-kicker">House Notes</p>
              <h3 className="tv-title">Good to Know</h3>
              <div className="mt-5 space-y-4 text-xl text-white/85">
                <p>
                  <span className="text-white/65">Quiet hours:</span> {unit.quietHours}
                </p>
                <p>
                  <span className="text-white/65">Parking:</span> {unit.parkingReminder}
                </p>
                <p>
                  <span className="text-white/65">Support:</span> {unit.supportText}
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        <footer className="rounded-2xl border border-white/15 bg-black/25 px-6 py-4 backdrop-blur-sm">
          <p className="text-lg text-white/80">
            Thank you for staying with The Paradise Collection. Relax, unwind, and enjoy your South Florida escape.
          </p>
          {(unit.instagramHandle || unit.directBookingUrl) ? (
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-lg">
              {unit.instagramHandle ? (
                <a
                  href={`https://instagram.com/${unit.instagramHandle.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-white/90 underline decoration-white/40 underline-offset-2 hover:text-white"
                >
                  Follow @{unit.instagramHandle.replace(/^@/, "")} on Instagram
                </a>
              ) : null}
              {unit.directBookingUrl ? (
                <span className="text-white/85">
                  <a
                    href={unit.directBookingUrl.startsWith("http") ? unit.directBookingUrl : `https://${unit.directBookingUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-white/90 underline decoration-white/40 underline-offset-2 hover:text-white"
                  >
                    Book direct at {unit.directBookingUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                  {unit.directBookingPromo ? (
                    <span className="ml-2 text-[#bfe0d8]">— {unit.directBookingPromo}</span>
                  ) : null}
                </span>
              ) : null}
            </div>
          ) : null}
          <p className="mt-2 text-sm text-white/50">Page refreshes in {refreshCountdown}</p>
        </footer>
      </div>
    </main>
  );
}
