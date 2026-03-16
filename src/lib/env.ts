export function isMockDataEnabled(): boolean {
  const publicFlag = process.env.NEXT_PUBLIC_USE_MOCK_DATA;
  const serverFlag = process.env.USE_MOCK_DATA;
  const value = publicFlag ?? serverFlag ?? "false";
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

/** Server-only: Lodgify API key for fetching reservations. When set, dashboard uses API instead of iCal. */
export function getLodgifyApiKey(): string | null {
  const key = (process.env.LODGIFY_API_KEY ?? "").trim();
  return key.length > 0 ? key : null;
}
