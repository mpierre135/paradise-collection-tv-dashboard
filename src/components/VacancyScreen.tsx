import { WeatherSnapshot, Recommendation, UnitConfig } from "@/src/types";
import { ClockDisplay } from "@/src/components/ClockDisplay";
import { WeatherCard } from "@/src/components/WeatherCard";
import { RecommendationsPanel } from "@/src/components/RecommendationsPanel";

type VacancyScreenProps = {
  unit: UnitConfig;
  weather: WeatherSnapshot | null;
  recommendations: Recommendation[];
};

export function VacancyScreen({ unit, weather, recommendations }: VacancyScreenProps) {
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

        <RecommendationsPanel recommendations={recommendations} />
      </div>
    </main>
  );
}
