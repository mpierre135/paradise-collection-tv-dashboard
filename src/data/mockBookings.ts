import { addDays, subDays } from "date-fns";
import { NormalizedBooking } from "@/src/types";

type MockBookingByUnit = Record<string, NormalizedBooking>;

export function getMockBookings(now: Date): MockBookingByUnit {
  return {
    "unit-poinsettia-3br": {
      isOccupied: true,
      guestFirstName: "Sarah",
      checkIn: subDays(now, 2),
      checkOut: addDays(now, 3),
      nightsRemaining: 3,
      isCheckoutDay: false,
      checkoutHasPassed: false
    },
    "unit-poinsettia-2br": {
      isOccupied: true,
      guestFirstName: "Daniel",
      checkIn: subDays(now, 1),
      checkOut: addDays(now, 1),
      nightsRemaining: 1,
      isCheckoutDay: false,
      checkoutHasPassed: false
    },
    "unit-poinsettia-1br": {
      isOccupied: false,
      guestFirstName: null,
      checkIn: null,
      checkOut: null,
      nightsRemaining: 0,
      isCheckoutDay: false,
      checkoutHasPassed: false
    }
  };
}
