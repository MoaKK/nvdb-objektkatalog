import { z } from "zod";
import type { Sokevalg } from "@/lib/nvdb/sok";

const TILSTAND_NOKKEL = "nvdb-sidemeny";
const SCROLL_NOKKEL = "nvdb-sidemeny-scroll";

const tilstandSchema = z.object({
  valg: z.object({
    tekst: z.string().max(100),
    iEgenskaper: z.boolean(),
    iVerdier: z.boolean(),
    kategoriId: z.number().int().positive().nullable(),
    sortering: z.enum(["navn", "nummer"]),
    bareElektro: z.boolean().default(false),
    visSomListe: z.boolean().default(false),
  }),
  apne: z.array(z.enum(["1", "2", "3", "annet"])),
});

export interface SidemenyTilstand {
  valg: Sokevalg;
  apne: string[];
}

export function lesTilstand(): SidemenyTilstand | null {
  try {
    const raw = sessionStorage.getItem(TILSTAND_NOKKEL);
    if (!raw) return null;
    const resultat = tilstandSchema.safeParse(JSON.parse(raw));
    return resultat.success ? resultat.data : null;
  } catch {
    return null;
  }
}

export function lagreTilstand(tilstand: SidemenyTilstand) {
  try {
    sessionStorage.setItem(TILSTAND_NOKKEL, JSON.stringify(tilstand));
  } catch {}
}

export function lesScroll(): number {
  try {
    const verdi = Number(sessionStorage.getItem(SCROLL_NOKKEL));
    return Number.isFinite(verdi) && verdi > 0 ? verdi : 0;
  } catch {
    return 0;
  }
}

export function lagreScroll(top: number) {
  try {
    sessionStorage.setItem(SCROLL_NOKKEL, String(Math.round(top)));
  } catch {}
}