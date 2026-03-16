import { UnitConfig } from "@/src/types";

type WifiGuideCardProps = {
  unit: UnitConfig;
  wifiQrDataUrl: string | null;
  guideQrDataUrl: string | null;
};

function QrBlock({ title, qrDataUrl, fallbackText }: { title: string; qrDataUrl: string | null; fallbackText: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
      <p className="text-lg font-semibold text-white">{title}</p>
      {qrDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={qrDataUrl}
          alt={`${title} QR code`}
          className="mt-3 h-28 w-28 rounded-lg border border-white/20 bg-white p-1"
        />
      ) : (
        <p className="mt-3 text-base text-white/80">{fallbackText}</p>
      )}
    </div>
  );
}

export function WifiGuideCard({ unit, wifiQrDataUrl, guideQrDataUrl }: WifiGuideCardProps) {
  return (
    <section className="tv-card h-full">
      <p className="tv-kicker">House Access</p>
      <h3 className="tv-title">Wi-Fi + Guide</h3>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <QrBlock title="Connect Wi-Fi" qrDataUrl={wifiQrDataUrl} fallbackText="Use network and password below." />
        <QrBlock
          title="Digital House Guide"
          qrDataUrl={guideQrDataUrl}
          fallbackText={unit.guideUrl ? "Open the guide URL on your phone." : "Guide not available"}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-white/15 bg-black/20 p-4">
        <p className="text-base uppercase tracking-[0.16em] text-white/65">Network</p>
        <p className="text-2xl text-white">{unit.wifiName}</p>
        {!wifiQrDataUrl ? <p className="mt-2 text-base text-white/70">Password: {unit.wifiPassword}</p> : null}
      </div>
    </section>
  );
}
