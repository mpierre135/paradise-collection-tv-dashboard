export function isMockDataEnabled(): boolean {
  const publicFlag = process.env.NEXT_PUBLIC_USE_MOCK_DATA;
  const serverFlag = process.env.USE_MOCK_DATA;
  const value = publicFlag ?? serverFlag ?? "false";
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}
