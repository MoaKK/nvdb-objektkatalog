import "server-only";
import { z } from "zod";

const epostliste = z
  .string()
  .transform((s) =>
    s
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  )
  .pipe(z.array(z.email()).min(1, "ADMIN_EMAILS må inneholde minst én e-postadresse"));

const envSchema = z.object({
  NVDB_API_BASE: z.url().default("https://nvdbapiles.atlas.vegvesen.no"),
  NVDB_X_CLIENT: z.string().min(3).max(100),
  DATABASE_URL: z.string().regex(/^postgres(ql)?:\/\//, "DATABASE_URL må være en Postgres-URL"),
  GOOGLE_CLIENT_ID: z.string().min(10),
  GOOGLE_CLIENT_SECRET: z.string().min(10),
  BETTER_AUTH_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET må være minst 32 tegn"),
  ADMIN_EMAILS: epostliste,
});

export const env = envSchema.parse({
  NVDB_API_BASE: process.env.NVDB_API_BASE,
  NVDB_X_CLIENT: process.env.NVDB_X_CLIENT,
  DATABASE_URL: process.env.DATABASE_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  ADMIN_EMAILS: process.env.ADMIN_EMAILS,
});
