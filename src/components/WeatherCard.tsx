import { WeatherSnapshot } from "@/src/types";

type WeatherCardProps = {
  weather: WeatherSnapshot | null;
  city: string;
};

export function WeatherCard({ weather, city }: WeatherCardProps) {
  return (
    <section className="tv-card">
      <p className="tv-kicker">Weather</p>
      <h3 className="tv-title">{city} — 7 Day Forecast</h3>

      {!weather ? (
        <p className="mt-8 text-2xl text-white/80">Weather temporarily unavailable</p>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex items-baseline gap-4">
            <p className="text-5xl font-semibold text-white">{weather.temperatureF}°</p>
            <div>
              <p className="text-xl text-white/90">{weather.weatherLabel}</p>
              <p className="text-lg text-white/75">Today: High {weather.dailyHighF}° / Low {weather.dailyLowF}°</p>
            </div>
          </div>
          {weather.daily && weather.daily.length > 0 ? (
            <div className="grid grid-cols-7 gap-2 pt-2 border-t border-white/15">
              {weather.daily.map((day) => (
                <div
                  key={day.date || day.dayLabel}
                  className="rounded-xl bg-white/10 px-2 py-3 text-center"
                >
                  <p className="text-sm font-medium text-white/90">{day.dayLabel}</p>
                  <p className="mt-1 text-xs text-white/75 line-clamp-2">{day.weatherLabel}</p>
                  <p className="mt-2 text-base font-semibold text-white">{day.highF}°</p>
                  <p className="text-sm text-white/70">{day.lowF}°</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
