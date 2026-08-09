import { randomBytes } from "crypto";
import { ObjectId, type Collection, type Db } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";

export type TeamRole = "owner" | "member";

export type TeamDocument = {
  _id?: ObjectId;
  name: string;
  inviteCode: string;
  ownerId: string;
  memberIds: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type TeamMemberDocument = {
  teamId: string;
  userId: string;
  role: TeamRole;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

type TeamCreationInput = {
  name: string;
  ownerId: string;
};

type JoinTeamInput = {
  inviteCode: string;
  userId: string;
};

const TEAMS_COLLECTION = "teams";
const TEAM_MEMBERS_COLLECTION = "teamMembers";

const inviteAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

let indexesReady: Promise<void> | null = null;

function normalizeInviteCode(inviteCode: string) {
  return inviteCode.trim().toUpperCase();
}

function generateInviteCode(length = 8) {
  const bytes = randomBytes(length);
  let inviteCode = "";

  for (let index = 0; index < length; index += 1) {
    inviteCode += inviteAlphabet[bytes[index] % inviteAlphabet.length];
  }

  return inviteCode;
}

function getTeamsCollection(db: Db): Collection<TeamDocument> {
  return db.collection<TeamDocument>(TEAMS_COLLECTION);
}

function getTeamMembersCollection(db: Db): Collection<TeamMemberDocument> {
  return db.collection<TeamMemberDocument>(TEAM_MEMBERS_COLLECTION);
}

export async function ensureTeamIndexes(db?: Db) {
  const database = db ?? (await getMongoDb());

  indexesReady ??= Promise.all([
    getTeamsCollection(database).createIndex({ inviteCode: 1 }, { unique: true }),
    getTeamsCollection(database).createIndex({ ownerId: 1 }),
    getTeamsCollection(database).createIndex({ memberIds: 1 }),
    getTeamMembersCollection(database).createIndex({ teamId: 1, userId: 1 }, { unique: true }),
    getTeamMembersCollection(database).createIndex({ userId: 1 }),
  ]).then(() => undefined);

  return indexesReady;
}

export async function createTeam(input: TeamCreationInput) {
  const db = await getMongoDb();
  await ensureTeamIndexes(db);

  const teams = getTeamsCollection(db);
  const teamMembers = getTeamMembersCollection(db);
  const now = new Date();
  const ownerId = input.ownerId.trim();
  const name = input.name.trim();

  if (!name) {
    throw new Error("Team name is required.");
  }

  if (!ownerId) {
    throw new Error("Owner ID is required.");
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const inviteCode = generateInviteCode();

    try {
      const result = await teams.insertOne({
        name,
        inviteCode,
        ownerId,
        memberIds: [ownerId],
        createdAt: now,
        updatedAt: now,
      });

      await teamMembers.insertOne({
        teamId: result.insertedId.toString(),
        userId: ownerId,
        role: "owner",
        joinedAt: now,
        createdAt: now,
        updatedAt: now,
      });

      return {
        teamId: result.insertedId.toString(),
        name,
        inviteCode,
        ownerId,
        memberIds: [ownerId],
        createdAt: now,
        updatedAt: now,
      };
    } catch (error) {
      if (attempt === 4) {
        throw error;
      }
    }
  }

  throw new Error("Failed to create team.");
}

export async function findTeamByInviteCode(inviteCode: string) {
  const db = await getMongoDb();
  await ensureTeamIndexes(db);

  return getTeamsCollection(db).findOne({ inviteCode: normalizeInviteCode(inviteCode) });
}

export async function listTeamsForUser(userId: string) {
  const db = await getMongoDb();
  await ensureTeamIndexes(db);

  return getTeamsCollection(db)
    .find({ memberIds: userId.trim() })
    .sort({ updatedAt: -1 })
    .toArray();
}

export async function joinTeamByInviteCode(input: JoinTeamInput) {
  const db = await getMongoDb();
  await ensureTeamIndexes(db);

  const inviteCode = normalizeInviteCode(input.inviteCode);
  const userId = input.userId.trim();

  if (!inviteCode) {
    throw new Error("Invite code is required.");
  }

  if (!userId) {
    throw new Error("User ID is required.");
  }

  const team = await getTeamsCollection(db).findOneAndUpdate(
    { inviteCode },
    {
      $addToSet: { memberIds: userId },
      $set: { updatedAt: new Date() },
    },
    { returnDocument: "after" },
  );

  if (!team) {
    return null;
  }

  const teamId = team._id?.toString();

  if (!teamId) {
    throw new Error("Team ID missing from invite lookup.");
  }

  await getTeamMembersCollection(db).updateOne(
    { teamId, userId },
    {
      $setOnInsert: {
        joinedAt: new Date(),
        createdAt: new Date(),
      },
      $set: {
        role: team.ownerId === userId ? "owner" : "member",
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  return team;
}

export async function leaveTeam(teamId: string, userId: string) {
  const db = await getMongoDb();
  await ensureTeamIndexes(db);

  const normalizedTeamId = teamId.trim();
  const normalizedUserId = userId.trim();

  if (!normalizedTeamId || !normalizedUserId) {
    throw new Error("Team ID and user ID are required.");
  }

  const teams = getTeamsCollection(db);
  const teamMembers = getTeamMembersCollection(db);

  await teamMembers.deleteOne({ teamId: normalizedTeamId, userId: normalizedUserId });

  if (!ObjectId.isValid(normalizedTeamId)) {
    throw new Error("Invalid team ID.");
  }

  const team = await teams.findOneAndUpdate(
    { _id: new ObjectId(normalizedTeamId) },
    {
      $pull: { memberIds: normalizedUserId },
      $set: { updatedAt: new Date() },
    },
    { returnDocument: "after" },
  );

  return team;
}
