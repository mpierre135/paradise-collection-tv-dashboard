import { DailyForecastEntry, WeatherSnapshot } from "@/src/types";

const MOCK_DAILY: DailyForecastEntry[] = [
  { date: "", dayLabel: "Today", weatherCode: 1, weatherLabel: "Mostly clear", highF: 82, lowF: 72 },
  { date: "", dayLabel: "Mon", weatherCode: 2, weatherLabel: "Partly cloudy", highF: 81, lowF: 71 },
  { date: "", dayLabel: "Tue", weatherCode: 3, weatherLabel: "Cloudy", highF: 79, lowF: 70 },
  { date: "", dayLabel: "Wed", weatherCode: 80, weatherLabel: "Rain showers", highF: 78, lowF: 69 },
  { date: "", dayLabel: "Thu", weatherCode: 2, weatherLabel: "Partly cloudy", highF: 80, lowF: 70 },
  { date: "", dayLabel: "Fri", weatherCode: 0, weatherLabel: "Clear skies", highF: 83, lowF: 72 },
  { date: "", dayLabel: "Sat", weatherCode: 1, weatherLabel: "Mostly clear", highF: 84, lowF: 73 }
];

/** Mock weather for UI preview when NEXT_PUBLIC_USE_MOCK_DATA is true. No API call. */
export function getMockWeatherSnapshot(): WeatherSnapshot {
  return {
    temperatureF: 78,
    weatherCode: 1,
    weatherLabel: "Mostly clear",
    dailyHighF: 82,
    dailyLowF: 72,
    daily: MOCK_DAILY
  };
}

const WEATHER_LABELS: Record<number, string> = {
  0: "Clear skies",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Cloudy",
  45: "Foggy",
  48: "Freezing fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  56: "Freezing drizzle",
  57: "Heavy freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Heavy showers",
  82: "Violent showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Storm and hail",
  99: "Severe hail"
};

export function weatherCodeToLabel(code: number): string {
  return WEATHER_LABELS[code] ?? "Conditions unavailable";
}

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
};

export async function fetchWeatherSnapshot(
  latitude: number,
  longitude: number
): Promise<WeatherSnapshot | null> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", latitude.toString());
  url.searchParams.set("longitude", longitude.toString());
  url.searchParams.set("current", "temperature_2m,weather_code");
  url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min");
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("timezone", "auto");

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 900 }
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as OpenMeteoResponse;

    const temperatureF = Math.round(payload.current?.temperature_2m ?? NaN);
    const weatherCode = payload.current?.weather_code;
    const times = payload.daily?.time ?? [];
    const codes = payload.daily?.weather_code ?? [];
    const maxTemps = payload.daily?.temperature_2m_max ?? [];
    const minTemps = payload.daily?.temperature_2m_min ?? [];
    const dailyHigh = maxTemps[0];
    const dailyLow = minTemps[0];

    if (!Number.isFinite(temperatureF) || weatherCode === undefined || dailyHigh === undefined || dailyLow === undefined) {
      return null;
    }

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const daily: DailyForecastEntry[] = times.slice(0, 7).map((dateStr, i) => {
      const date = dateStr ? new Date(dateStr + "T12:00:00") : new Date();
      const dayLabel = i === 0 ? "Today" : dayLabels[date.getDay()];
      const code = codes[i] ?? 0;
      return {
        date: dateStr,
        dayLabel,
        weatherCode: code,
        weatherLabel: weatherCodeToLabel(code),
        highF: Math.round(maxTemps[i] ?? 0),
        lowF: Math.round(minTemps[i] ?? 0)
      };
    });

    return {
      temperatureF,
      weatherCode,
      weatherLabel: weatherCodeToLabel(weatherCode),
      dailyHighF: Math.round(dailyHigh),
      dailyLowF: Math.round(dailyLow),
      daily: daily.length > 0 ? daily : undefined
    };
  } catch (error) {
    console.error("Weather fetch failed", error);
    return null;
  }
}
