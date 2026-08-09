import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { getMongoDb } from "@/lib/mongodb";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

const db = await getMongoDb();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? appUrl,
  trustedOrigins: [appUrl],
  plugins: [nextCookies()],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    autoSignIn: true,
    requireEmailVerification: false,
  },
});
