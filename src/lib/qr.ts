import QRCode from "qrcode";

function escapeWifiValue(value: string): string {
  return value.replace(/([\\;,:\"])/g, "\\$1");
}

export function buildWifiQrValue(ssid: string, password: string): string {
  const safeSsid = escapeWifiValue(ssid);
  const safePassword = escapeWifiValue(password);
  return `WIFI:T:WPA;S:${safeSsid};P:${safePassword};;`;
}

export async function generateQrDataUrl(value: string): Promise<string | null> {
  try {
    return await QRCode.toDataURL(value, {
      margin: 1,
      width: 240,
      errorCorrectionLevel: "M",
      color: {
        dark: "#0a1f2b",
        light: "#ffffffff"
      }
    });
  } catch (error) {
    console.error("QR generation failed", error);
    return null;
  }
}
