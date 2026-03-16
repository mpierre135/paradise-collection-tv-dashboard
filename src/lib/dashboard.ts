import { getMockBookings } from "@/src/data/mockBookings";
import { recommendations } from "@/src/data/recommendations";
import { units } from "@/src/data/units";
import { upsells } from "@/src/data/upsells";
import { getLodgifyApiKey, isMockDataEnabled } from "@/src/lib/env";
import { isoNow } from "@/src/lib/dates";
import { getActiveBookingFromApi, getActiveBookingFromIcal, normalizeMockBooking } from "@/src/lib/lodgify";
import { buildWifiQrValue, generateQrDataUrl } from "@/src/lib/qr";
import { fetchWeatherSnapshot, getMockWeatherSnapshot } from "@/src/lib/weather";
import { UnitDashboardData } from "@/src/types";

export type DashboardWithQr = UnitDashboardData & {
  qr: {
    wifi: string | null;
    guide: string | null;
    upsellById: Record<string, string | null>;
  };
};

export async function getDashboardDataBySlug(slug: string): Promise<DashboardWithQr | null> {
  const unit = units.find((candidate) => candidate.slug === slug);
  if (!unit) {
    return null;
  }

  const now = new Date();

  const apiKey = getLodgifyApiKey();
  const useApi = Boolean(apiKey && unit.lodgifyPropertyId != null);
  const bookingPromise = isMockDataEnabled()
    ? Promise.resolve(normalizeMockBooking(getMockBookings(now)[unit.id], unit.checkoutTime, unit.timezone, now))
    : useApi
      ? getActiveBookingFromApi(unit.lodgifyPropertyId!, apiKey!, unit.checkoutTime, unit.timezone, now)
      : getActiveBookingFromIcal(unit.lodgifyIcalUrl, unit.checkoutTime, unit.timezone, now);

  const weatherPromise = isMockDataEnabled()
    ? Promise.resolve(getMockWeatherSnapshot())
    : fetchWeatherSnapshot(unit.latitude, unit.longitude);

  const selectedUpsells = upsells
    .filter((upsell) => unit.upsellIds.includes(upsell.id))
    .filter((upsell) => upsell.isActive);

  const selectedRecommendations = recommendations
    .filter((rec) => unit.recommendationIds.includes(rec.id))
    .filter((rec) => rec.isFeatured)
    .slice(0, 6);

  const [booking, weather] = await Promise.all([bookingPromise, weatherPromise]);

  const wifiQrPromise = generateQrDataUrl(buildWifiQrValue(unit.wifiName, unit.wifiPassword));
  const guideQrPromise = unit.guideUrl ? generateQrDataUrl(unit.guideUrl) : Promise.resolve(null);
  const upsellQrPromises = selectedUpsells.map(async (upsell) => {
    const value = upsell.ctaQrValue ?? upsell.ctaUrl;
    return {
      id: upsell.id,
      qr: value ? await generateQrDataUrl(value) : null
    };
  });

  const [wifiQr, guideQr, upsellQrEntries] = await Promise.all([
    wifiQrPromise,
    guideQrPromise,
    Promise.all(upsellQrPromises)
  ]);

  return {
    unit,
    booking,
    weather,
    upsells: selectedUpsells,
    recommendations: selectedRecommendations,
    generatedAt: isoNow(),
    qr: {
      wifi: wifiQr,
      guide: guideQr,
      upsellById: Object.fromEntries(upsellQrEntries.map((entry) => [entry.id, entry.qr]))
    }
  };
}
