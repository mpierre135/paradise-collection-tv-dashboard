import { WeatherSnapshot, Recommendation, UnitConfig, Upsell } from "@/src/types";
import { ClockDisplay } from "@/src/components/ClockDisplay";
import { WeatherCard } from "@/src/components/WeatherCard";
import { RecommendationsPanel } from "@/src/components/RecommendationsPanel";
import { UpsellsPanel } from "@/src/components/UpsellsPanel";

type VacancyScreenProps = {
  unit: UnitConfig;
  weather: WeatherSnapshot | null;
  recommendations: Recommendation[];
  upsells: Upsell[];
  qrById: Record<string, string | null>;
};

export function VacancyScreen({ unit, weather, recommendations, upsells, qrById }: VacancyScreenProps) {
  return (
    <main className="tv-safe relative min-h-screen overflow-hidden p-8 text-white md:p-12 lg:p-12">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${unit.theme.backgroundImageUrl})` }}
        aria-hidden
      />
      <div className="absolute inset-0" style={{ background: unit.theme.overlayGradient }} aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_36%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.16),transparent_30%)]" aria-hidden />

      <div className="relative mx-auto flex h-full max-w-[1800px] flex-col gap-8">
        <header className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/75">The Paradise Collection</p>
            <h1 className="mt-2 max-w-4xl font-display text-6xl leading-tight text-white md:text-7xl">
              Welcome to {unit.propertyName}
            </h1>
            <p className="mt-4 text-2xl text-white/80">
              {unit.city}, {unit.state}
            </p>
            <p className="mt-4 max-w-3xl text-xl text-white/85">
              This home is currently preparing for the next guest arrival. Enjoy local recommendations while you wait.
            </p>
          </div>
          <ClockDisplay timezone={unit.timezone} />
        </header>

        <div className="grid flex-1 gap-6 xl:grid-cols-3">
          <WeatherCard weather={weather} city={unit.city} />
          <div className="tv-card xl:col-span-2">
            <p className="tv-kicker">Property Highlights</p>
            <h3 className="tv-title">Experience South Florida in Style</h3>
            <p className="mt-5 text-2xl text-white/85">
              Private comfort, curated design, and thoughtful hospitality from check-in to checkout.
            </p>
            <p className="mt-4 text-xl text-white/75">For assistance: {unit.supportText}</p>
          </div>
        </div>

        <UpsellsPanel upsells={upsells} qrById={qrById} />
        <RecommendationsPanel recommendations={recommendations} />

        {(unit.instagramHandle || unit.directBookingUrl) ? (
          <footer className="rounded-2xl border border-white/15 bg-black/25 px-6 py-4 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-lg">
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
          </footer>
        ) : null}
      </div>
    </main>
  );
}
