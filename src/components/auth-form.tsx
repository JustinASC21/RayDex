"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

type AuthMode = "login" | "signup";

type AuthFormProps = {
	mode: AuthMode;
};

const copy: Record<AuthMode, { action: string; footerText: string; footerLink: string; footerHref: string }> = {
	login: {
		action: "Sign in",
		footerText: "New here?",
		footerLink: "Create an account",
		footerHref: "/auth/signup",
	},
	signup: {
		action: "Create account",
		footerText: "Already have an account?",
		footerLink: "Sign in instead",
		footerHref: "/auth/login",
	},
};

export function AuthForm({ mode }: AuthFormProps) {
	const [error, setError] = useState<string | null>(null);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		setError(null);

		if (mode === "signup" && !name.trim()) {
			event.preventDefault();
			setError("Enter a display name to create your account.");
			return;
		}
	};

	const formAction = mode === "signup" ? "/api/signup" : "/api/login";

	return (
		<form className="space-y-5" action={formAction} method="post" onSubmit={handleSubmit}>
			{mode === "signup" ? (
				<label className="block space-y-2">
					<span className="text-sm font-medium text-slate-700">Display name</span>
					<input
						className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-slate-950"
						autoComplete="name"
						name="name"
						value={name}
						onChange={(event) => setName(event.target.value)}
						placeholder="Alex Collector"
						required
					/>
				</label>
			) : null}

			<input name="rememberMe" type="hidden" value="true" />

			<label className="block space-y-2">
				<span className="text-sm font-medium text-slate-700">Email</span>
				<input
					className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-slate-950"
					autoComplete="email"
					inputMode="email"
					name="email"
					type="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					placeholder="you@example.com"
					required
				/>
			</label>

			<label className="block space-y-2">
				<span className="text-sm font-medium text-slate-700">Password</span>
				<input
					className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-slate-950"
					autoComplete={mode === "signup" ? "new-password" : "current-password"}
					minLength={12}
					name="password"
					type="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					placeholder="At least 12 characters"
					required
				/>
			</label>

			<p className="text-xs leading-5 text-slate-500">
				Passwords must be at least 12 characters. Sessions are handled with secure, HTTP-only cookies.
			</p>

			{error ? (
				<p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert" aria-live="polite">
					{error}
				</p>
			) : null}

			<button
				className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
				type="submit"
			>
				{copy[mode].action}
			</button>

			<p className="text-sm text-slate-600">
				{copy[mode].footerText} {" "}
				<Link className="font-medium text-slate-950 underline underline-offset-4" href={copy[mode].footerHref}>
					{copy[mode].footerLink}
				</Link>
			</p>
		</form>
	);
}

