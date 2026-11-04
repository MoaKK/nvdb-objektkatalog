import "server-only";
import { eq, isNotNull, or } from "drizzle-orm";
import { db } from "@/db";
import { egenskapskrav, objekttypekrav } from "@/db/schema";
import type { Kravoversikt } from "@/lib/krav/typer";

export async function hentKravoversikt(): Promise<Kravoversikt> {
  const [egenskaper, objekter, elektro] = await Promise.all([
    db
      .selectDistinct({ id: egenskapskrav.vegobjekttypeId })
      .from(egenskapskrav)
      .where(or(eq(egenskapskrav.kreves, true), isNotNull(egenskapskrav.beskrivelse))),
    db
      .select({ id: objekttypekrav.vegobjekttypeId })
      .from(objekttypekrav)
      .where(
        or(
          eq(objekttypekrav.fkb, true),
          isNotNull(objekttypekrav.fkbKommentar),
          isNotNull(objekttypekrav.tilleggsinformasjon),
        ),
      ),
    db
      .select({ id: objekttypekrav.vegobjekttypeId })
      .from(objekttypekrav)
      .where(eq(objekttypekrav.elektro, true)),
  ]);

  const sorter = (ider: number[]) => [...new Set(ider)].sort((a, b) => a - b);

  return {
    medKrav: sorter([...egenskaper, ...objekter].map((r) => r.id)),
    elektro: sorter(elektro.map((r) => r.id)),
  };
}
