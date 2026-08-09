import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">RayDex</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Sign in</h1>
          <p className="text-sm leading-6 text-slate-600">Access your team collection with a secure email and password session.</p>
        </div>
        <AuthForm mode="login" />
      </section>
    </main>
  );
}
