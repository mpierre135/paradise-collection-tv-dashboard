import { notFound } from "next/navigation";
import { units } from "@/src/data/units";
import { getDashboardDataBySlug } from "@/src/lib/dashboard";
import { TVWelcomeScreen } from "@/src/components/TVWelcomeScreen";
import { VacancyScreen } from "@/src/components/VacancyScreen";

export const revalidate = 300;

type UnitPageProps = {
  params: {
    unitSlug: string;
  };
};

export function generateStaticParams() {
  return units.map((unit) => ({ unitSlug: unit.slug }));
}

export default async function UnitPage({ params }: UnitPageProps) {
  const data = await getDashboardDataBySlug(params.unitSlug);
  if (!data) {
    notFound();
  }

  const bookingView = {
    isOccupied: data.booking.isOccupied,
    guestFirstName: data.booking.guestFirstName,
    checkInIso: data.booking.checkIn ? data.booking.checkIn.toISOString() : null,
    checkOutIso: data.booking.checkOut ? data.booking.checkOut.toISOString() : null,
    nightsRemaining: data.booking.nightsRemaining
  };

  if (!data.booking.isOccupied) {
    return (
      <VacancyScreen
        unit={data.unit}
        weather={data.weather}
        recommendations={data.recommendations}
        upsells={data.upsells}
        qrById={data.qr.upsellById}
      />
    );
  }

  return (
    <TVWelcomeScreen
      unit={data.unit}
      booking={bookingView}
      weather={data.weather}
      upsells={data.upsells}
      recommendations={data.recommendations}
      qr={data.qr}
    />
  );
}
