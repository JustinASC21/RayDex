import { MongoClient, type Db } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB ?? "RayDex";

if (!mongoUri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

declare global {
  var __raydexMongoClient: Promise<MongoClient> | undefined;
}

const client = new MongoClient(mongoUri);
const clientPromise = globalThis.__raydexMongoClient ?? client.connect();

if (process.env.NODE_ENV !== "production") {
  globalThis.__raydexMongoClient = clientPromise;
}

export async function getMongoDb(): Promise<Db> {
  const connectedClient = await clientPromise;
  return connectedClient.db(mongoDbName);
}
