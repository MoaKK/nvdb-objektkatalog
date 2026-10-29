import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Leser .env.local på samme måte som Next.js, så DATABASE_URL aldri står i koden
loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL mangler i .env.local");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL },
  strict: true,
});
