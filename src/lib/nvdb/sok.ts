import type { VegobjekttypeIndeks } from "@/lib/nvdb/schemas";
import { tilDatakategori, type Datakategori } from "@/lib/nvdb/kategori";

export interface Sokevalg {
  tekst: string;
  iEgenskaper: boolean;
  iVerdier: boolean;
  kategoriId: number | null;
  sortering: "navn" | "nummer";
  bareElektro: boolean;
  visSomListe: boolean;
}

export const STANDARD_SOKEVALG: Sokevalg = {
  tekst: "",
  iEgenskaper: false,
  iVerdier: false,
  kategoriId: null,
  sortering: "navn",
  bareElektro: false,
  visSomListe: false,
};

export interface Sokeresultat {
  type: VegobjekttypeIndeks;
  treff: string | null;
}

export type Sokegrupper = Record<Datakategori, Sokeresultat[]>;

export function sokVegobjekttyper(indeks: VegobjekttypeIndeks[], valg: Sokevalg): Sokegrupper {
  const q = valg.tekst.trim().toLowerCase();
  const grupper: Sokegrupper = { "1": [], "2": [], "3": [], annet: [] };

  for (const type of indeks) {
    if (valg.kategoriId !== null && !type.kategorier.includes(valg.kategoriId)) continue;

    let treff: string | null = null;
    let match = q.length === 0 || type.navn.toLowerCase().includes(q) || String(type.id) === q;

    if (!match && valg.iEgenskaper) {
      const egenskap = type.egenskaper.find((navn) => navn.toLowerCase().includes(q));
      if (egenskap) {
        match = true;
        treff = `Egenskap: ${egenskap}`;
      }
    }

    if (!match && valg.iVerdier) {
      const verdi = type.verdier.find((v) => v.toLowerCase().includes(q));
      if (verdi) {
        match = true;
        treff = `Verdi: ${verdi}`;
      }
    }

    if (match) grupper[tilDatakategori(type.hovedkategori)].push({ type, treff });
  }

  for (const gruppe of Object.values(grupper)) sorterResultater(gruppe, valg.sortering);
  return grupper;
}
export function sorterResultater(liste: Sokeresultat[], sortering: Sokevalg["sortering"]) {
  return liste.sort((a, b) =>
    sortering === "nummer" ? a.type.id - b.type.id : a.type.navn.localeCompare(b.type.navn, "nb"),
  );
}
