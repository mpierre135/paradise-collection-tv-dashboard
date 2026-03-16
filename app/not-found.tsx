import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a1f2b] p-8 text-white">
      <div className="max-w-xl rounded-3xl border border-white/15 bg-white/10 p-8 text-center">
        <h1 className="font-display text-5xl">Unit Not Found</h1>
        <p className="mt-3 text-xl text-white/80">
          The requested TV route does not match an existing Paradise Collection unit.
        </p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-white/20 px-5 py-3 text-lg hover:bg-white/30">
          Back to routes
        </Link>
      </div>
    </main>
  );
}
