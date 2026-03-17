import { getMockBookings } from "@/src/data/mockBookings";
import { recommendations } from "@/src/data/recommendations";
import { units } from "@/src/data/units";
import { upsells } from "@/src/data/upsells";
import { getLodgifyApiKey, isMockDataEnabled } from "@/src/lib/env";
import { isoNow } from "@/src/lib/dates";
import { getActiveBookingFromApi, getActiveBookingFromIcal, normalizeMockBooking } from "@/src/lib/lodgify";
import { buildWifiQrValue, generateQrDataUrl } from "@/src/lib/qr";
import { fetchWeatherSnapshot, getMockWeatherSnapshot } from "@/src/lib/weather";
import type { NormalizedBooking } from "@/src/types";
import { UnitDashboardData } from "@/src/types";

/** When the three-bedroom (main unit) is occupied, its booking is shown on 1BR and 2BR screens. */
const MAIN_UNIT_SLUG = "poinsettia-3br";

export type DashboardWithQr = UnitDashboardData & {
  qr: {
    wifi: string | null;
    guide: string | null;
    upsellById: Record<string, string | null>;
  };
};

function getBookingForUnit(
  unit: (typeof units)[number],
  now: Date,
  apiKey: string | undefined,
  useApi: boolean
): Promise<NormalizedBooking> {
  return isMockDataEnabled()
    ? Promise.resolve(normalizeMockBooking(getMockBookings(now)[unit.id], unit.checkoutTime, unit.timezone, now))
    : useApi
      ? getActiveBookingFromApi(unit.lodgifyPropertyId!, apiKey!, unit.checkoutTime, unit.timezone, now, unit.lodgifyRoomTypeId)
      : getActiveBookingFromIcal(unit.lodgifyIcalUrl, unit.checkoutTime, unit.timezone, now);
}

export async function getDashboardDataBySlug(slug: string): Promise<DashboardWithQr | null> {
  const unit = units.find((candidate) => candidate.slug === slug);
  if (!unit) {
    return null;
  }

  const now = new Date();
  const apiKey = getLodgifyApiKey();
  const useApi = Boolean(apiKey && unit.lodgifyPropertyId != null);

  const bookingPromise = getBookingForUnit(unit, now, apiKey ?? undefined, useApi);
  const weatherPromise = isMockDataEnabled()
    ? Promise.resolve(getMockWeatherSnapshot())
    : fetchWeatherSnapshot(unit.latitude, unit.longitude);

  const selectedUpsells = upsells
    .filter((upsell) => unit.upsellIds.includes(upsell.id))
    .filter((upsell) => upsell.isActive);

  const selectedRecommendations = recommendations
    .filter((rec) => unit.recommendationIds.includes(rec.id))
    .filter((rec) => rec.isFeatured);

  const mainUnit = slug !== MAIN_UNIT_SLUG ? units.find((u) => u.slug === MAIN_UNIT_SLUG) : null;
  const mainBookingPromise =
    mainUnit != null ? getBookingForUnit(mainUnit, now, apiKey ?? undefined, Boolean(apiKey && mainUnit.lodgifyPropertyId != null)) : null;

  const [booking, weather, mainBooking] = await Promise.all([
    bookingPromise,
    weatherPromise,
    mainBookingPromise ?? Promise.resolve(null)
  ]);

  const displayBooking =
    mainUnit != null && mainBooking != null && mainBooking.isOccupied ? mainBooking : booking;

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
    booking: displayBooking,
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
