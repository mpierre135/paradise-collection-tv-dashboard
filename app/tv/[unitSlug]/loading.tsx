export default function UnitLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a1f2b] p-8 text-white [padding:env(safe-area-inset-top)_env(safe-area-inset-right)_env(safe-area-inset-bottom)_env(safe-area-inset-left)]">
      <div className="flex flex-col items-center gap-6">
        <p className="text-sm uppercase tracking-[0.2em] text-white/60">The Paradise Collection</p>
        <div className="h-3 w-48 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-1/2 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-white/30" />
        </div>
        <p className="text-lg text-white/70">Loading your dashboard…</p>
      </div>
    </main>
  );
}
