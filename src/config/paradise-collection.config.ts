/**
 * Paradise Collection – single editable config
 *
 * Edit this file to update for all units:
 * - Lodgify: either set LODGIFY_API_KEY + lodgifyPropertyId per unit (API) or use lodgifyIcalUrl (iCal)
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
    lodgifyPropertyId: 612248,
    lodgifyRoomTypeId: 679101,
    lodgifyIcalUrl:
      "https://www.lodgify.com/3ef9451a-1b82-4c8f-a513-cd29dd2809e4.ics",
    wifiName: "Poinsettia Paradise 5GHz ",
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
      "fl-dinner-bandoleros-pr",
      "fl-beach-pr",
      "fl-grocery-pr",
      "fl-grocery-publix-pr",
      "fl-photographer-chrisheadshots-pr",
      "fl-movies-paradigm-pr",
      "fl-pharmacy-pr"
    ],
    theme: {
      accentColor: "#D8A25E",
      overlayGradient:
        "linear-gradient(120deg, rgba(9,27,36,0.90), rgba(14,69,81,0.74), rgba(216,162,94,0.48))",
      backgroundImageUrl:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1800&q=80"
    },
    instagramHandle: "poinsettiaparadise",
    directBookingUrl: "https://paradiseftl.com",
    directBookingPromo: "Save 10% on your next booking"
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
    lodgifyPropertyId: 504695,
    lodgifyRoomTypeId: 504695,
    lodgifyIcalUrl:
      "https://www.lodgify.com/c0f79efe-5d7a-4592-9b94-deb4dbe26722.ics",
    wifiName: "Poinsettia Paradise 5GHz ",
    wifiPassword: "Paradise1400",
    guideUrl: "https://www.airbnb.com/s/guidebooks?refinement_paths%5B%5D=/guidebooks/3272653",
    checkoutTime: "11:00",
    supportPhone: "+1 (954) 555-0110",
    supportText: "Text host for anything: +1 (954) 669-1874",
    quietHours: "10:00 PM - 8:00 AM",
    parkingReminder: "No street parking. Use assigned spots first.",
    upsellIds: ["late-checkout", "midstay-clean", "laundry-coins", "firewood", "luggage-storage", "extra-guest"],
    recommendationIds: [
      "fl-cafe-pr",
      "fl-breakfast-pr",
      "fl-dinner-pr",
      "fl-dinner-bandoleros-pr",
      "fl-beach-pr",
      "fl-grocery-pr",
      "fl-grocery-publix-pr",
      "fl-photographer-chrisheadshots-pr",
      "fl-movies-paradigm-pr"
    ],
    theme: {
      accentColor: "#9ED0B8",
      overlayGradient:
        "linear-gradient(135deg, rgba(8,24,33,0.92), rgba(22,91,86,0.72), rgba(109,165,145,0.44))",
      backgroundImageUrl:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=80"
    },
    instagramHandle: "poinsettiaparadise",
    directBookingUrl: "https://paradiseftl.com",
    directBookingPromo: "Save 10% on your next booking"
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
    lodgifyPropertyId: 571049,
    lodgifyRoomTypeId: 571049,
    lodgifyIcalUrl:
      "https://www.lodgify.com/c0faf222-8ef2-4881-be06-2d9ffbeec849.ics",
    wifiName: "Poinsettia Paradise 5GHz ",
    wifiPassword: "Paradise1400",
    guideUrl: "https://www.airbnb.com/s/guidebooks?refinement_paths%5B%5D=/guidebooks/3272653",
    checkoutTime: "11:00",
    supportPhone: "+1 (954) 669-1874",
    supportText: "Need help? Call or text +1 (954) 669-1874",
    quietHours: "10:00 PM - 8:00 AM",
    parkingReminder: "Keep driveway clear for shared access.",
    upsellIds: ["late-checkout", "midstay-clean", "firewood", "luggage-storage"],
    recommendationIds: [
      "fl-cafe-pr",
      "fl-breakfast-pr",
      "fl-dinner-pr",
      "fl-dinner-bandoleros-pr",
      "fl-beach-pr",
      "fl-photographer-chrisheadshots-pr",
      "fl-movies-paradigm-pr",
      "fl-pharmacy-pr"
    ],
    theme: {
      accentColor: "#F2C48E",
      overlayGradient:
        "linear-gradient(120deg, rgba(10,28,37,0.90), rgba(20,84,95,0.70), rgba(242,196,142,0.40))",
      backgroundImageUrl:
        "https://images.unsplash.com/photo-1464890100898-a385f744067f?auto=format&fit=crop&w=1800&q=80"
    },
    instagramHandle: "poinsettiaparadise",
    directBookingUrl: "https://paradiseftl.com",
    directBookingPromo: "Save 10% on your next booking"
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
    ctaUrl: "https://buy.stripe.com/28E28qbfx15IdLvcyTfUQ04",
    isActive: true
  },
  {
    id: "midstay-clean",
    title: "Mid-Stay Refresh",
    description: "Professional housekeeping reset during your visit.",
    priceText: "$100",
    ctaLabel: "Schedule Cleaning",
    ctaUrl: "https://buy.stripe.com/14A5kCerJ7u69vfbuPfUQ05",
    isActive: true
  },
  {
    id: "laundry-coins",
    title: "Laundry Coins",
    description: "Quarters for the washer/dryer. $5 or $10 — scan to pay with CashApp.",
    priceText: "$5 / $10",
    ctaLabel: "Pay with CashApp",
    // Replace with your CashApp payment link (e.g. https://cash.app/$YourCashtag) so the QR code opens your CashApp.
    ctaQrValue: "https://cash.app/$mp1350",
    isActive: true
  },
  {
    id: "firewood",
    title: "Firewood",
    description: "Bundle of firewood delivered for your stay.",
    priceText: "$20",
    ctaLabel: "Request Firewood",
    ctaUrl: "https://buy.stripe.com/eVq00i6Zh29M7n7dCXfUQ06",
    isActive: true
  },
  {
    id: "luggage-storage",
    title: "Luggage Storage",
    description: "Store bags before check-in or after checkout.",
    priceText: "$25",
    ctaLabel: "Arrange Storage",
    ctaUrl: "https://buy.stripe.com/00w00i0AT4hU36ReH1fUQ02",
    isActive: true
  },
  {
    id: "extra-guest",
    title: "Extra Guest",
    description: "Add an additional guest to your reservation.",
    priceText: "$50",
    ctaLabel: "Add Guest",
    ctaUrl: "https://buy.stripe.com/5kQ9AS1EX3dQbDn9mHfUQ03",
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
    distance: "1.5 mi",
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
    id: "fl-grocery-publix-pr",
    category: "Grocery",
    name: "Publix",
    description: "Local supermarket for groceries, deli, and pharmacy.",
    distance: "1.5 mi",
    mapsUrl: "https://maps.google.com/?q=Publix+Fort+Lauderdale",
    isFeatured: true
  },
  {
    id: "fl-dinner-bandoleros-pr",
    category: "Dinner",
    name: "Bandoleros Tacos & Tequila Bar",
    description: "Tacos, tequila, and lively atmosphere.",
    distance: "2.0 mi",
    mapsUrl: "https://maps.google.com/?q=Bandoleros+Tacos+Tequila+Bar+Fort+Lauderdale",
    tuesdayPromo: "All you can eat tacos",
    isFeatured: true
  },
  {
    id: "fl-photographer-chrisheadshots-pr",
    category: "Professional Photographer",
    name: "Chris Headshots",
    description: "Professional headshots and portraits. Book at new.chrisheadshots.com.",
    mapsUrl: "http://new.chrisheadshots.com",
    isFeatured: true
  },
  {
    id: "fl-movies-paradigm-pr",
    category: "Movie Theater",
    name: "Paradigm Cinemas",
    description: "Closest movie theater.",
    mapsUrl: "https://paradigmcinemas.com/",
    tuesdayPromo: "All Movies $6",
    isFeatured: true
  },
  {
    id: "fl-pharmacy-pr",
    category: "Pharmacy",
    name: "Walgreens on Sunrise",
    description: "Late-night essentials and prescriptions.",
    distance: "1.7 mi",
    mapsUrl: "https://maps.google.com/?q=Walgreens+Sunrise+Boulevard+Fort+Lauderdale",
    isFeatured: false
  }
];
