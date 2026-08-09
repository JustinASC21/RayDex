"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";

type TeamModalProps = {
  triggerLabel: string;
  triggerClassName?: string;
  align?: "start" | "end";
};

type TeamMode = "create" | "join";

type TeamActionState = {
  type: "success" | "error" | null;
  message: string;
};

export function TeamModal({ triggerLabel, triggerClassName, align = "start" }: TeamModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<TeamMode>("create");
  const [isPending, setIsPending] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [state, setState] = useState<TeamActionState>({ type: null, message: "" });

  const closeModal = useCallback(() => {
    setOpen(false);
    setState({ type: null, message: "" });
    setTeamName("");
    setInviteCode("");
    setMode("create");
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const submitCreateTeam = async () => {
    const response = await fetch("/api/teams/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: teamName }),
    });

    const payload = (await response.json()) as {
      team?: { name: string; inviteCode: string };
      error?: { code?: string; message?: string };
    };

    if (!response.ok) {
      throw new Error(payload.error?.message ?? "Unable to create team.");
    }

    setState({
      type: "success",
      message: `Created ${payload.team?.name ?? "team"}. Invite code: ${payload.team?.inviteCode ?? "unknown"}.`,
    });
    router.refresh();
  };

  const submitJoinTeam = async () => {
    const response = await fetch("/api/teams/join", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ inviteCode }),
    });

    const payload = (await response.json()) as {
      team?: { name: string };
      error?: { code?: string; message?: string };
    };

    if (!response.ok) {
      if (payload.error?.code === "UNAUTHORIZED") {
        setState({ type: "error", message: "Sign in first, then create or join a team." });
        return;
      }

      throw new Error(payload.error?.message ?? "Unable to join team.");
    }

    setState({ type: "success", message: `Joined ${payload.team?.name ?? "team"}.` });
    router.refresh();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ type: null, message: "" });
    setIsPending(true);

    try {
      if (mode === "create") {
        await submitCreateTeam();
      } else {
        await submitJoinTeam();
      }
    } catch (error) {
      setState({
        type: "error",
        message: error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setIsPending(false);
    }
  };

  const openModal = () => {
    setOpen(true);
  }

  return (
    <>
      <button
        className={triggerClassName ?? "inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-900 transition hover:border-slate-950"}
        onClick={openModal}
        type="button"
      >
        {triggerLabel}
      </button>

      {open && typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            closeModal();
          }
        }}>
          <div className={`w-full max-w-lg rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_30px_120px_rgba(15,23,42,0.3)] ${align === "end" ? "origin-top-right" : "origin-top-left"}`} role="dialog" aria-modal="true" aria-labelledby="team-modal-title">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Team setup</p>
                <h2 id="team-modal-title" className="text-2xl font-semibold tracking-tight text-slate-950">Create or join a team</h2>
                <p className="text-sm leading-6 text-slate-600">Teams keep shared Pokemon collection data organized by invite code.</p>
              </div>
              <button className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:border-slate-950 hover:text-slate-950" type="button" onClick={closeModal}>
                Close
              </button>
            </div>

            <div className="mt-6 flex rounded-full bg-slate-100 p-1">
              <button className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${mode === "create" ? "bg-slate-950 text-white" : "text-slate-600 hover:text-slate-950"}`} type="button" onClick={() => setMode("create")}>
                Create team
              </button>
              <button className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${mode === "join" ? "bg-slate-950 text-white" : "text-slate-600 hover:text-slate-950"}`} type="button" onClick={() => setMode("join")}>
                Join team
              </button>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              {mode === "create" ? (
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">Team name</span>
                  <input
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-slate-950"
                    name="teamName"
                    value={teamName}
                    onChange={(event) => setTeamName(event.target.value)}
                    placeholder="Kanto Collectors"
                    required
                  />
                </label>
              ) : (
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">Invite code</span>
                  <input
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-slate-950"
                    name="inviteCode"
                    value={inviteCode}
                    onChange={(event) => setInviteCode(event.target.value)}
                    placeholder="ABCD1234"
                    required
                  />
                </label>
              )}

              {state.type ? (
                <p className={`rounded-2xl px-4 py-3 text-sm ${state.type === "success" ? "border border-emerald-200 bg-emerald-50 text-emerald-800" : "border border-red-200 bg-red-50 text-red-700"}`} role="status" aria-live="polite">
                  {state.message}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending ? "Working..." : mode === "create" ? "Create team" : "Join team"}
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-4 py-3 font-medium text-slate-900 transition hover:border-slate-950"
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
