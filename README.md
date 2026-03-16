# The Paradise Collection TV Dashboard (MVP)

Production-ready Next.js MVP for TV-friendly guest welcome dashboards in short-term rental properties.

## Features

- Unit-based TV routes:
  - `/tv/poinsettia-3br`
  - `/tv/poinsettia-2br`
  - `/tv/poinsettia-1br`
- Lodgify reservations via **API** (guest data) or **iCal** (calendar feed)
- Active guest welcome and stay dates
- Open-Meteo weather by unit coordinates
- Dynamic checkout panel with live checkout-day countdown
- Wi-Fi + house guide QR codes
- Upsells cards with CTA/QR
- Nearby recommendations panel with gentle rotation
- Branded vacancy fallback when no active reservation is found
- Config-driven content model for easy edits
- TV-friendly visual hierarchy, animations, and auto-refresh

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- `date-fns` + `date-fns-tz`
- `node-ical`
- `qrcode`
- Open-Meteo API

## Architecture Summary

- **Routes:** One dynamic route `app/tv/[unitSlug]/page.tsx`; `generateStaticParams` pre-renders the three unit slugs.
- **Data flow:** For each request, `getDashboardDataBySlug(slug)` (in `src/lib/dashboard.ts`) loads the unit from `src/data/units.ts`, then in parallel:
  - **Booking:** If `NEXT_PUBLIC_USE_MOCK_DATA` is true, uses `src/data/mockBookings.ts` (and mock weather). Otherwise, if `LODGIFY_API_KEY` is set and the unit has `lodgifyPropertyId`, the app uses the [Lodgify Reservations API](https://docs.lodgify.com/reference/reservations) for real guest data; if not, it falls back to the unit’s iCal URL (guest name parsed from event text). Blocked/owner events are ignored.
  - **Weather:** Mock mode returns a fixed snapshot; otherwise Open-Meteo is called with the unit’s lat/long in `src/lib/weather.ts`.
  - **Upsells & recommendations:** Filtered by unit’s `upsellIds` and `recommendationIds` from the single config file.
  - **QR codes:** Generated server-side for Wi-Fi, guide URL, and each upsell CTA via `src/lib/qr.ts`.
- **View:** If there is an active booking, `TVWelcomeScreen` is rendered with booking, weather, upsells, recommendations, and QR data; otherwise `VacancyScreen` is shown (same unit, weather, recommendations, no checkout/upsells).
- **TV polish:** Safe-area padding, 15‑minute auto-refresh with countdown, loading skeleton, and Framer Motion entrance animations. All editable content is driven from **one config file** (see below); `src/data/*` re-export from it.

## Project Structure

```txt
app/
  layout.tsx
  globals.css
  tv/[unitSlug]/
    page.tsx
    loading.tsx
src/
  components/
    TVWelcomeScreen.tsx
    WeatherCard.tsx
    CheckoutCard.tsx
    WifiGuideCard.tsx
    UpsellsPanel.tsx
    RecommendationsPanel.tsx
    VacancyScreen.tsx
    ClockDisplay.tsx
  config/
    paradise-collection.config.ts   # single editable config (iCal, Wi‑Fi, guides, checkout, support, upsells, recommendations)
  data/
    units.ts                        # re-exports from config
    recommendations.ts
    upsells.ts
    mockBookings.ts
  lib/
    dashboard.ts
    lodgify.ts
    weather.ts
    dates.ts
    qr.ts
    formatters.ts
    env.ts
  types/
    index.ts
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` for local preview (recommended; uses mock data so no Lodgify or API keys are needed):

```bash
cp .env.example .env.local
```

Or create `.env.local` with:

```bash
NEXT_PUBLIC_USE_MOCK_DATA=true
```

3. Run locally:

```bash
npm run dev
```

4. Open TV routes:

- `http://localhost:3000/tv/poinsettia-3br`
- `http://localhost:3000/tv/poinsettia-2br`
- `http://localhost:3000/tv/poinsettia-1br`

## Single config file (no UI edits needed)

All operational content is in **`src/config/paradise-collection.config.ts`**. Edit this file only when you need to change:

| What to change | Where in config |
|----------------|------------------|
| **Lodgify** | Either set `LODGIFY_API_KEY` + `unitsConfig[].lodgifyPropertyId` (API, real guest names) or keep `lodgifyIcalUrl` (iCal feed) |
| **Wi‑Fi** | `unitsConfig[].wifiName`, `unitsConfig[].wifiPassword` |
| **House guide links** | `unitsConfig[].guideUrl` (used for QR and fallback text) |
| **Checkout times** | `unitsConfig[].checkoutTime` – use 24h format, e.g. `"11:00"` |
| **Support** | `unitsConfig[].supportPhone`, `unitsConfig[].supportText` |
| **Upsells per unit** | `unitsConfig[].upsellIds` – list of ids from `upsellsConfig` |
| **Recommendations per unit** | `unitsConfig[].recommendationIds` – list of ids from `recommendationsConfig` |
| **Upsell content** (titles, prices, CTA links) | `upsellsConfig[]` – `title`, `description`, `priceText`, `ctaLabel`, `ctaUrl`, `ctaQrValue` |
| **Recommendation content** (names, maps links) | `recommendationsConfig[]` – `name`, `category`, `description`, `distance`, `mapsUrl`, `isFeatured` |

- Keep `checkoutTime` as `HH:mm` (24h).
- Confirm `timezone` for each unit (defaults: `America/New_York`).
- Do not edit `src/data/units.ts`, `src/data/upsells.ts`, or `src/data/recommendations.ts` for content changes; they re-export from the config.

If the API or iCal fetch fails, the app falls back to a branded vacancy-safe state.

### Lodgify: API vs iCal

- **API (recommended):** Set `LODGIFY_API_KEY` in your environment and add `lodgifyPropertyId` (numeric) to each unit in the config. The app will call `GET https://api.lodgify.com/v1/reservation/reservations?property_id=...` and use the reservation’s guest name and dates. Get your API key and property IDs from the Lodgify dashboard.
- **iCal:** Leave `LODGIFY_API_KEY` unset (or omit `lodgifyPropertyId`). The app uses each unit’s `lodgifyIcalUrl` and parses guest name from the event summary/description.

## Editing Content

Edit **`src/config/paradise-collection.config.ts`** only.

### Units (`unitsConfig`)

- Names, slugs, location, timezone
- **Lodgify:** either **API** (`lodgifyPropertyId` + env `LODGIFY_API_KEY`) or **iCal** (`lodgifyIcalUrl`). **Wi‑Fi** (name/password), **guide URL**
- **Checkout time** (24h), **support phone** and **support text**
- Quiet hours, parking reminder
- **`upsellIds`** and **`recommendationIds`** (which upsells/recommendations this unit shows)
- Unit-level theme/background

### Upsells (`upsellsConfig`)

- `title`, `description`, `priceText`, `ctaLabel`, `ctaUrl` or `ctaQrValue`, `isActive`
- Assign which upsells each unit shows via `unitsConfig[].upsellIds`.

### Recommendations (`recommendationsConfig`)

- `category`, `name`, `description`
- optional `distance` and `mapsUrl`
- `isFeatured`

Assign which recommendations each unit shows via `unitsConfig[].recommendationIds`.

## Mock Mode

Use mock booking data for reliable UI testing without external feeds:

```bash
NEXT_PUBLIC_USE_MOCK_DATA=true
```

Mock bookings are defined in `src/data/mockBookings.ts`.

## Auto Refresh + Live Updates

- Clock and checkout countdown update live on the client.
- TV page automatically reloads every 15 minutes to refresh booking/weather/QR data.
- Server-side fetches are revalidated for iCal and weather to reduce API load.

## Deployment (Vercel)

1. Push this project to GitHub.
2. Import into Vercel.
3. Set env var in Vercel:
   - `NEXT_PUBLIC_USE_MOCK_DATA=false` (for production iCal usage)
4. Deploy.

## Go-Live Checklist: Replace With Real Paradise Collection Content

Before going live with real Lodgify and production content, replace the following:

| Item | Where | What to do |
|------|--------|------------|
| **Lodgify** | Config + env | Either set `LODGIFY_API_KEY` and `lodgifyPropertyId` per unit (API) or keep real `lodgifyIcalUrl` (iCal). |
| **Disable mock data** | Environment (e.g. Vercel) | Set `NEXT_PUBLIC_USE_MOCK_DATA=false` so the app uses real Lodgify and live weather. |
| **Unit display names & property names** | Config: `unitsConfig[]` | Confirm `propertyName`, `displayName`, `city`, `state` for each unit. |
| **Wi-Fi credentials** | Config: `unitsConfig[]` | Set real `wifiName` and `wifiPassword` per unit. |
| **House guide URL** | Config: `unitsConfig[].guideUrl` | Replace with your real digital guide link per unit. |
| **Support phone & text** | Config: `unitsConfig[]` | Replace `supportPhone` and `supportText` with real host/support contact. |
| **Quiet hours & parking** | Config: `unitsConfig[]` | Update `quietHours` and `parkingReminder` per property if needed. |
| **Unit theme / background images** | Config: `unitsConfig[].theme` | Replace `backgroundImageUrl` with real Paradise Collection photos if desired. |
| **Upsell CTAs** | Config: `upsellsConfig[]` | Replace `ctaUrl` and `ctaQrValue` with real booking/contact links or SMS numbers. |
| **Recommendations** | Config: `recommendationsConfig[]` | Update names, descriptions, `mapsUrl`, and distances to real Paradise Collection favorites. |

After replacing the above and setting `NEXT_PUBLIC_USE_MOCK_DATA=false`, redeploy and test each unit route for an occupied and a vacant day (or use Lodgify test calendar).

## Notes

- MVP intentionally has no auth, CMS, Airbnb sync, or payments.
- Architecture is optimized for fast deployment and easy content edits.
