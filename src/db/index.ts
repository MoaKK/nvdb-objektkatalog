import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "@/db/auth-schema";
import * as schema from "@/db/schema";
import { env } from "@/lib/env";

export const db = drizzle({
  client: neon(env.DATABASE_URL),
  schema: { ...schema, ...authSchema },
});
