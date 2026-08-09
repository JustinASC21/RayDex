import { auth } from "@/lib/auth";
import { joinTeamByInviteCode } from "@/lib/teams";

type TeamJoinBody = {
  inviteCode?: string;
};

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user?.id) {
    return Response.json({ error: { code: "UNAUTHORIZED", message: "Sign in to join a team." } }, { status: 401 });
  }

  let body: TeamJoinBody;

  try {
    body = (await request.json()) as TeamJoinBody;
  } catch {
    return Response.json({ error: { code: "INVALID_BODY", message: "Invalid team payload." } }, { status: 400 });
  }

  const inviteCode = body.inviteCode?.trim();

  if (!inviteCode) {
    return Response.json({ error: { code: "INVITE_CODE_REQUIRED", message: "Invite code is required." } }, { status: 400 });
  }

  const team = await joinTeamByInviteCode({
    inviteCode,
    userId: session.user.id,
  });

  if (!team) {
    return Response.json({ error: { code: "TEAM_NOT_FOUND", message: "We could not find a team for that invite code." } }, { status: 404 });
  }

  return Response.json({ team }, { status: 200 });
}
