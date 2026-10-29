import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";
import { env } from "@/lib/env";

const ADMINER = new Set(env.ADMIN_EMAILS);

export function erAdminEpost(epost?: string | null) {
  return !!epost && ADMINER.has(epost.trim().toLowerCase());
}

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema: authSchema }),

  // Bare Google, ingen passord lagres hos oss
  emailAndPassword: { enabled: false },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      // La brukeren velge konto i stedet for å bruke den som tilfeldigvis er innlogget
      prompt: "select_account",
    },
  },

  // Tokens fra Google krypteres før de lagres i databasen
  account: { encryptOAuthTokens: true },

  session: {
    expiresIn: 60 * 60 * 8, // en arbeidsdag
    updateAge: 60 * 60, // fornyes maks én gang i timen ved bruk
    // Sesjonen bufres i en kryptert cookie (JWE) så ikke hvert kall går mot databasen
    cookieCache: { enabled: true, maxAge: 5 * 60, strategy: "jwe" },
  },

  advanced: {
    // Secure-cookies (og __Secure-prefiks) når siden kjører på https
    useSecureCookies: env.BETTER_AUTH_URL.startsWith("https://"),
    // httpOnly: JavaScript i siden kan ikke lese cookien.
    // sameSite lax: andre nettsteder kan ikke sende den med i skjema/fetch,
    // men den overlever omdirigeringen tilbake fra Google.
    defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
  },

  databaseHooks: {
    // Bare e-poster på admin-listen får opprettet bruker
    user: {
      create: {
        before: async (user) => {
          if (!erAdminEpost(user.email)) return false;
        },
      },
    },
    // ... og bare de får sesjon, også om de senere fjernes fra listen
    session: {
      create: {
        before: async (session) => {
          const [bruker] = await db
            .select({ email: authSchema.user.email })
            .from(authSchema.user)
            .where(eq(authSchema.user.id, session.userId))
            .limit(1);
          if (!bruker || !erAdminEpost(bruker.email)) return false;
        },
      },
    },
  },

  // Lar server actions sette cookies (trengs senere for lagring)
  plugins: [nextCookies()],
});
