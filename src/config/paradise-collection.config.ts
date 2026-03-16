/**
 * Paradise Collection – single editable config
 *
 * Edit this file to update for all units:
 * - Lodgify iCal URLs (replace placeholder URLs with real Lodgify calendar feeds)
 * - Wi-Fi name and password per unit
 * - House guide links (QR code and fallback)
 * - Checkout times (24h format, e.g. "11:00")
 * - Support phone and support text
 * - Which upsells and recommendations each unit shows
 *
 * Upsells and recommendations content (titles, links, prices) are also defined here.
 * You do not need to touch UI code when changing these values.
 */

import type { Recommendation, UnitConfig, Upsell } from "@/src/types";

// ─── Units (iCal, Wi‑Fi, guide, checkout, support, upsells, recommendations) ───

export const unitsConfig: UnitConfig[] = [
  {
    id: "unit-poinsettia-3br",
    slug: "poinsettia-3br",
    propertyName: "Poinsettia Paradise",
    displayName: "Poinsettia Paradise",
    city: "Fort Lauderdale",
    state: "FL",
    timezone: "America/New_York",
    latitude: 26.1224,
    longitude: -80.1373,
    lodgifyIcalUrl:
      "https://www.lodgify.com/3ef9451a-1b82-4c8f-a513-cd29dd2809e4.ics",
    wifiName: "Poinsettia Paradise 2.4Ghz ",
    wifiPassword: "Paradise1400",
    guideUrl: "www.airbnb.com/s/guidebooks?refinement_paths%5B%5D=/guidebooks/3272653",
    checkoutTime: "11:00",
    supportPhone: "+1 (954) 555-0110",
    supportText: "Host Support: +1 (954) 669-1874",
    quietHours: "10:00 PM - 8:00 AM",
    parkingReminder: "Please park only in designated driveway spaces.",
    upsellIds: ["late-checkout", "midstay-clean", "laundry-coins", "firewood", "luggage-storage", "extra-guest"],
    recommendationIds: [
      "fl-cafe-pr",
      "fl-breakfast-pr",
      "fl-dinner-pr",
      "fl-beach-pr",
      "fl-grocery-pr",
      "fl-pharmacy-pr"
    ],
    theme: {
      accentColor: "#D8A25E",
      overlayGradient:
        "linear-gradient(120deg, rgba(9,27,36,0.90), rgba(14,69,81,0.74), rgba(216,162,94,0.48))",
      backgroundImageUrl:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1800&q=80"
    }
  },
  {
    id: "unit-poinsettia-2br",
    slug: "poinsettia-2br",
    propertyName: "Poinsettia Paradise",
    displayName: "Poinsettia Paradise 1400",
    city: "Fort Lauderdale",
    state: "FL",
    timezone: "America/New_York",
    latitude: 26.1219,
    longitude: -80.1358,
    lodgifyIcalUrl:
      "https://www.lodgify.com/c0f79efe-5d7a-4592-9b94-deb4dbe26722.ics",
    wifiName: "Poinsettia Paradise 2.4Ghz ",
    wifiPassword: "Paradise1400",
    guideUrl: "https://www.airbnb.com/s/guidebooks?refinement_paths%5B%5D=/guidebooks/3272653",
    checkoutTime: "11:00",
    supportPhone: "+1 (954) 555-0110",
    supportText: "Text host for anything: +1 (954) 669-1874",
    quietHours: "10:00 PM - 8:00 AM",
    parkingReminder: "No street parking. Use assigned spots first.",
    upsellIds: ["late-checkout", "midstay-clean", "laundry-coins", "firewood", "luggage-storage", "extra-guest"],
    recommendationIds: ["fl-cafe-pr", "fl-breakfast-pr", "fl-dinner-pr", "fl-beach-pr", "fl-grocery-pr"],
    theme: {
      accentColor: "#9ED0B8",
      overlayGradient:
        "linear-gradient(135deg, rgba(8,24,33,0.92), rgba(22,91,86,0.72), rgba(109,165,145,0.44))",
      backgroundImageUrl:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=80"
    }
  },
  {
    id: "unit-poinsettia-1br",
    slug: "poinsettia-1br",
    propertyName: "Poinsettia Paradise",
    displayName: "Poinsettia Paradise 1402B",
    city: "Fort Lauderdale",
    state: "FL",
    timezone: "America/New_York",
    latitude: 26.1228,
    longitude: -80.1364,
    lodgifyIcalUrl:
      "https://www.lodgify.com/c0faf222-8ef2-4881-be06-2d9ffbeec849.ics",
    wifiName: "Poinsettia Paradise 2.4Ghz ",
    wifiPassword: "Paradise1400",
    guideUrl: "https://www.airbnb.com/s/guidebooks?refinement_paths%5B%5D=/guidebooks/3272653",
    checkoutTime: "11:00",
    supportPhone: "+1 (954) 555-0110",
    supportText: "Need help? Call or text +1 (954) 555-0110",
    quietHours: "10:00 PM - 8:00 AM",
    parkingReminder: "Keep driveway clear for shared access.",
    upsellIds: ["late-checkout", "midstay-clean", "firewood", "luggage-storage"],
    recommendationIds: ["fl-cafe-pr", "fl-breakfast-pr", "fl-dinner-pr", "fl-beach-pr", "fl-pharmacy-pr"],
    theme: {
      accentColor: "#F2C48E",
      overlayGradient:
        "linear-gradient(120deg, rgba(10,28,37,0.90), rgba(20,84,95,0.70), rgba(242,196,142,0.40))",
      backgroundImageUrl:
        "https://images.unsplash.com/photo-1464890100898-a385f744067f?auto=format&fit=crop&w=1800&q=80"
    }
  }
];

// ─── Upsells (titles, descriptions, prices, CTA links / QR) ───

export const upsellsConfig: Upsell[] = [
  {
    id: "late-checkout",
    title: "Late Checkout",
    description: "Enjoy a slower morning and extra time in paradise.",
    priceText: "$65",
    ctaLabel: "Request Late Checkout",
    ctaUrl: "https://example.com/upsells/late-checkout",
    isActive: true
  },
  {
    id: "midstay-clean",
    title: "Mid-Stay Refresh",
    description: "Professional housekeeping reset during your visit.",
    priceText: "$100",
    ctaLabel: "Schedule Cleaning",
    ctaUrl: "https://example.com/upsells/midstay-clean",
    isActive: true
  },
  {
    id: "laundry-coins",
    title: "Laundry Coins",
    description: "Quarters for the washer/dryer. $5 or $10 — scan to pay with CashApp.",
    priceText: "$5 / $10",
    ctaLabel: "Pay with CashApp",
    // Replace with your CashApp payment link (e.g. https://cash.app/$YourCashtag) so the QR code opens your CashApp.
    ctaQrValue: "https://cash.app/$YOUR_CASHTAG",
    isActive: true
  },
  {
    id: "firewood",
    title: "Firewood",
    description: "Bundle of firewood delivered for your stay.",
    priceText: "$20",
    ctaLabel: "Request Firewood",
    ctaUrl: "https://example.com/upsells/firewood",
    isActive: true
  },
  {
    id: "luggage-storage",
    title: "Luggage Storage",
    description: "Store bags before check-in or after checkout.",
    priceText: "$25",
    ctaLabel: "Arrange Storage",
    ctaUrl: "https://example.com/upsells/luggage-storage",
    isActive: true
  },
  {
    id: "extra-guest",
    title: "Extra Guest",
    description: "Add an additional guest to your reservation.",
    priceText: "$50",
    ctaLabel: "Add Guest",
    ctaUrl: "https://example.com/upsells/extra-guest",
    isActive: true
  }
];

// ─── Recommendations (name, category, description, distance, Maps link) ───

export const recommendationsConfig: Recommendation[] = [
  {
    id: "fl-cafe-pr",
    category: "Coffee",
    name: "Wells Coffee Co.",
    description: "Locally roasted espresso and calm morning vibe.",
    distance: "1.2 mi",
    mapsUrl: "https://maps.google.com/?q=Wells+Coffee+Co+Fort+Lauderdale",
    isFeatured: true
  },
  {
    id: "fl-breakfast-pr",
    category: "Breakfast",
    name: "Milk Money",
    description: "Brunch favorite with fresh pastries and classics.",
    distance: "2.1 mi",
    mapsUrl: "https://maps.google.com/?q=Milk+Money+Fort+Lauderdale",
    isFeatured: true
  },
  {
    id: "fl-dinner-pr",
    category: "Dinner",
    name: "Doc B's",
    description: "Local favorite for dinner.",
    distance: "",
    mapsUrl: "https://maps.google.com/?q=Ad+Doc+Bs+Fort+Lauderdale",
    isFeatured: true
  },
  {
    id: "fl-beach-pr",
    category: "Beach",
    name: "Fort Lauderdale Beach",
    description: "Wide shoreline, ocean breeze, and easy parking spots.",
    distance: "3.9 mi",
    mapsUrl: "https://maps.google.com/?q=Fort+Lauderdale+Beach",
    isFeatured: true
  },
  {
    id: "fl-grocery-pr",
    category: "Grocery",
    name: "Whole Foods Market",
    description: "Organic groceries and quick prepared meals.",
    distance: "2.3 mi",
    mapsUrl: "https://maps.google.com/?q=Whole+Foods+Fort+Lauderdale",
    isFeatured: true
  },
  {
    id: "fl-pharmacy-pr",
    category: "Pharmacy",
    name: "CVS on Sunrise",
    description: "Late-night essentials and prescriptions.",
    distance: "1.7 mi",
    mapsUrl: "https://maps.google.com/?q=CVS+Sunrise+Boulevard+Fort+Lauderdale",
    isFeatured: false
  }
];
