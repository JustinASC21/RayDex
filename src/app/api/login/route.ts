import { auth } from "@/lib/auth";

export async function POST(request: Request) {
	const formData = await request.formData();
	const body: Record<string, string | boolean> = {};

	for (const [key, value] of formData.entries()) {
		if (typeof value === "string") {
			if (key === "rememberMe") {
				body[key] = value === "true";
			} else {
				body[key] = value;
			}
		}
	}

	const authResponse = await auth.handler(
		new Request(new URL("/api/auth/sign-in/email", request.url), {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(body),
		}),
	);

	if (!authResponse.ok) {
		return authResponse;
	}

	const headers = new Headers();
	const setCookie = authResponse.headers.get("set-cookie");
	if (setCookie) {
		headers.set("set-cookie", setCookie);
	}
	headers.set("location", "/collection");

	return new Response(null, {
		status: 303,
		headers,
	});
}

