"use client"
import Link from "next/link";
import { TeamModal } from "@/components/team-modal";

export default function CollectionPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">RayDex</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Your collection</h1>
            <p className="max-w-2xl text-slate-600">This is the first authenticated landing page. Replace this template with your collection grid, filters, and team controls next.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <TeamModal triggerLabel="Create or join team" triggerClassName="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-900 transition hover:border-slate-950" align="end" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Collection total", "0 cards"],
            ["Teams", "1 active team"],
            ["Scan status", "Ready to scan"],
          ].map(([label, value]) => (
            <article key={label} className="rounded-[1.5rem] border border-slate-200 bg-white/70 p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
