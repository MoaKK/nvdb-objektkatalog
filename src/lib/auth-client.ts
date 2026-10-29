import { createAuthClient } from "better-auth/react";

// Snakker med /api/auth på samme domene. Inneholder ingen hemmeligheter.
export const authClient = createAuthClient();
