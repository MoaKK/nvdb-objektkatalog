import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { egenskapskrav, objekttypekrav } from "@/db/schema";
import type { Kravdata } from "@/lib/krav/typer";

export async function hentKrav(vegobjekttypeId: number): Promise<Kravdata> {
  const [egenskaper, objekt] = await Promise.all([
    db
      .select({
        egenskapstypeId: egenskapskrav.egenskapstypeId,
        kreves: egenskapskrav.kreves,
        beskrivelse: egenskapskrav.beskrivelse,
      })
      .from(egenskapskrav)
      .where(eq(egenskapskrav.vegobjekttypeId, vegobjekttypeId)),
    db
      .select({ fkb: objekttypekrav.fkb, fkbKommentar: objekttypekrav.fkbKommentar })
      .from(objekttypekrav)
      .where(eq(objekttypekrav.vegobjekttypeId, vegobjekttypeId))
      .limit(1),
  ]);

  return {
    fkb: objekt[0]?.fkb ?? false,
    fkbKommentar: objekt[0]?.fkbKommentar ?? null,
    egenskaper: Object.fromEntries(
      egenskaper.map((e) => [String(e.egenskapstypeId), { kreves: e.kreves, beskrivelse: e.beskrivelse }]),
    ),
  };
}
