import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// Håndterer /api/auth/* (innlogging, callback fra Google, utlogging, sesjon)
export const { GET, POST } = toNextJsHandler(auth);
