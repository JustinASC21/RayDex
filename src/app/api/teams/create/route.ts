import { auth } from "@/lib/auth";
import { createTeam } from "@/lib/teams";

type TeamCreateBody = {
  name?: string;
};

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user?.id) {
    return Response.json({ error: { code: "UNAUTHORIZED", message: "Sign in to create a team." } }, { status: 401 });
  }

  let body: TeamCreateBody;

  try {
    body = (await request.json()) as TeamCreateBody;
  } catch {
    return Response.json({ error: { code: "INVALID_BODY", message: "Invalid team payload." } }, { status: 400 });
  }

  const name = body.name?.trim();

  if (!name) {
    return Response.json({ error: { code: "TEAM_NAME_REQUIRED", message: "Team name is required." } }, { status: 400 });
  }

  const team = await createTeam({
    name,
    ownerId: session.user.id,
  });

  return Response.json({ team }, { status: 201 });
}
