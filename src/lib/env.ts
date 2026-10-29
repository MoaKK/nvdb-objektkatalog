import "server-only";
import { z } from "zod";

const envSchema = z.object({
  NVDB_API_BASE: z.url().default("https://nvdbapiles.atlas.vegvesen.no"),
  NVDB_X_CLIENT: z.string().min(3).max(100),
});

export const env = envSchema.parse({
  NVDB_API_BASE: process.env.NVDB_API_BASE,
  NVDB_X_CLIENT: process.env.NVDB_X_CLIENT,
});