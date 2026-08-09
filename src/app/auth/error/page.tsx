import Link from "next/link";
import { getAuthErrorMessage } from "@/lib/auth-error-messages";

type AuthErrorPageProps = {
  searchParams?: Promise<{
    code?: string;
    mode?: string;
  }>;
};

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = (await searchParams) ?? {};
  const { title, description, hint } = getAuthErrorMessage(params.code);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">RayDex</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
          <p>{hint}</p>
          <p className="text-xs text-amber-900/80">Error code: {params.code ?? "unknown"}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 font-medium text-white transition hover:bg-slate-800" href={params.mode === "signup" ? "/auth/signup" : "/auth/login"}>
            Back to {params.mode === "signup" ? "signup" : "sign in"}
          </Link>
          <Link className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-900 transition hover:border-slate-950" href="/">
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
