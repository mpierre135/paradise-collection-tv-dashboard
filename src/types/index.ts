export type UnitSlug = "poinsettia-3br" | "poinsettia-2br" | "poinsettia-1br";

export type Upsell = {
  id: string;
  title: string;
  description: string;
  priceText: string;
  ctaLabel: string;
  ctaUrl?: string;
  ctaQrValue?: string;
  isActive: boolean;
};

export type Recommendation = {
  id: string;
  category: string;
  name: string;
  description: string;
  distance?: string;
  mapsUrl?: string;
  isFeatured: boolean;
};

export type UnitTheme = {
  accentColor: string;
  overlayGradient: string;
  backgroundImageUrl?: string;
};

export type UnitConfig = {
  id: string;
  slug: UnitSlug;
  propertyName: string;
  displayName: string;
  city: string;
  state: string;
  timezone: string;
  latitude: number;
  longitude: number;
  lodgifyIcalUrl: string;
  wifiName: string;
  wifiPassword: string;
  guideUrl?: string;
  checkoutTime: string;
  supportPhone?: string;
  supportText: string;
  quietHours: string;
  parkingReminder: string;
  upsellIds: string[];
  recommendationIds: string[];
  theme: UnitTheme;
};

export type NormalizedBooking = {
  isOccupied: boolean;
  guestFirstName: string | null;
  checkIn: Date | null;
  checkOut: Date | null;
  nightsRemaining: number;
  isCheckoutDay: boolean;
  checkoutHasPassed: boolean;
};

export type DailyForecastEntry = {
  date: string;
  dayLabel: string;
  weatherCode: number;
  weatherLabel: string;
  highF: number;
  lowF: number;
};

export type WeatherSnapshot = {
  temperatureF: number;
  weatherCode: number;
  weatherLabel: string;
  dailyHighF: number;
  dailyLowF: number;
  daily?: DailyForecastEntry[];
};

export type UnitDashboardData = {
  unit: UnitConfig;
  booking: NormalizedBooking;
  weather: WeatherSnapshot | null;
  upsells: Upsell[];
  recommendations: Recommendation[];
  generatedAt: string;
};
