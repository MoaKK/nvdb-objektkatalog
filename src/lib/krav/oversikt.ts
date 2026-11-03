import "server-only";
import { eq, isNotNull, or } from "drizzle-orm";
import { db } from "@/db";
import { egenskapskrav, objekttypekrav } from "@/db/schema";

export async function hentTyperMedKrav(): Promise<number[]> {
  const [egenskaper, objekter] = await Promise.all([
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
  ]);

  return [...new Set([...egenskaper, ...objekter].map((r) => r.id))].sort((a, b) => a - b);
}
