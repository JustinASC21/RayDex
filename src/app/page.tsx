import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-4xl rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur md:p-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">RayDex</p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
              Sign in to manage your shared card collection.
            </h1>
            <p className="max-w-lg text-lg leading-8 text-slate-600">
              Create a secure account, join your team, and create your pokemon collection
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 font-medium text-white transition hover:bg-slate-800" href="/auth/login">
                Sign in
              </Link>
              <Link className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-900 transition hover:border-slate-950" href="/auth/signup">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
