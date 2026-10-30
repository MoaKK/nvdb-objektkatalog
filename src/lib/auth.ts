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

  emailAndPassword: { enabled: false },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      prompt: "select_account",
    },
  },

  account: { encryptOAuthTokens: true },

  session: {
    expiresIn: 60 * 60 * 8,
    updateAge: 60 * 60,
    cookieCache: { enabled: true, maxAge: 5 * 60, strategy: "jwe" },
  },

  advanced: {
    useSecureCookies: env.BETTER_AUTH_URL.startsWith("https://"),
    defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!erAdminEpost(user.email)) return false;
        },
      },
    },
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

  plugins: [nextCookies()],
});
