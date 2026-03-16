import { Upsell } from "@/src/types";

type UpsellsPanelProps = {
  upsells: Upsell[];
  qrById: Record<string, string | null>;
};

export function UpsellsPanel({ upsells, qrById }: UpsellsPanelProps) {
  if (!upsells.length) {
    return null;
  }

  return (
    <section className="tv-card">
      <p className="tv-kicker">Enhance Your Stay</p>
      <h3 className="tv-title">Featured Add-Ons</h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {upsells.slice(0, 4).map((upsell) => {
          const qr = qrById[upsell.id] ?? null;

          return (
            <article key={upsell.id} className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-2xl font-semibold text-white">{upsell.title}</h4>
                  <p className="mt-1 text-lg text-white/80">{upsell.description}</p>
                  <p className="mt-3 text-xl font-semibold text-[#ffdcb0]">{upsell.priceText}</p>
                  <p className="mt-2 text-base uppercase tracking-[0.12em] text-white/70">{upsell.ctaLabel}</p>
                </div>
                {qr ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qr} alt={`${upsell.title} CTA QR`} className="h-20 w-20 rounded-lg bg-white p-1" />
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
