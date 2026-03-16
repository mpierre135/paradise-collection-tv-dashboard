import Link from "next/link";
import { units } from "@/src/data/units";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a1f2b] p-8 text-white md:p-12">
      <div className="mx-auto max-w-5xl rounded-3xl border border-white/15 bg-white/5 p-8 shadow-glow backdrop-blur-md md:p-10">
        <p className="text-sm uppercase tracking-[0.18em] text-white/70">The Paradise Collection</p>
        <h1 className="mt-3 font-display text-5xl text-white md:text-6xl">TV Welcome Dashboard MVP</h1>
        <p className="mt-4 max-w-3xl text-xl text-white/80">
          Open a unit route below to preview the TV experience. Enable mock mode with
          <code className="ml-1 rounded bg-white/10 px-2 py-1">NEXT_PUBLIC_USE_MOCK_DATA=true</code>
          for local development.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {units.map((unit) => (
            <Link
              key={unit.slug}
              href={`/tv/${unit.slug}`}
              className="rounded-2xl border border-white/15 bg-white/10 p-5 text-xl transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              <p className="font-semibold">{unit.displayName}</p>
              <p className="mt-1 text-base text-white/75">
                {unit.city}, {unit.state}
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[#bfe0d8]">/tv/{unit.slug}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
