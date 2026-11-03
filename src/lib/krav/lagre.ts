"use server";

import { headers } from "next/headers";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { egenskapskrav, objekttypekrav } from "@/db/schema";
import { auth, erAdminEpost } from "@/lib/auth";
import { kravendringSchema } from "@/lib/krav/endring";
import { hentVegobjekttype } from "@/lib/nvdb/client";
import { SKJULTE_EGENSKAPSTYPER } from "@/lib/nvdb/schemas";

export type Lagreresultat = { ok: true } | { ok: false; feil: string };

export async function lagreKravendring(input: unknown): Promise<Lagreresultat> {
  const sesjon = await auth.api.getSession({ headers: await headers() });
  if (!sesjon || !erAdminEpost(sesjon.user.email)) {
    return { ok: false, feil: "Du må være innlogget som admin." };
  }

  const parsed = kravendringSchema.safeParse(input);
  if (!parsed.success) return { ok: false, feil: "Ugyldige data." };
  const endring = parsed.data;

  let type;
  try {
    type = await hentVegobjekttype(endring.vegobjekttypeId);
  } catch {
    return { ok: false, feil: "Fant ikke vegobjekttypen i NVDB." };
  }

  const brukerId = sesjon.user.id;

  try {
    if (
      endring.type === "fkb" ||
      endring.type === "fkbKommentar" ||
      endring.type === "tilleggsinformasjon" ||
      endring.type === "elektro"
    ) {
      const objektfelt =
        endring.type === "fkb"
          ? { fkb: endring.fkb }
          : endring.type === "fkbKommentar"
            ? { fkbKommentar: endring.kommentar || null }
            : endring.type === "tilleggsinformasjon"
              ? { tilleggsinformasjon: endring.tekst || null }
              : { elektro: endring.elektro };
      await db
        .insert(objekttypekrav)
        .values({ vegobjekttypeId: endring.vegobjekttypeId, ...objektfelt, oppdatertAv: brukerId })
        .onConflictDoUpdate({
          target: objekttypekrav.vegobjekttypeId,
          set: { ...objektfelt, oppdatert: sql`now()`, oppdatertAv: brukerId },
        });
      return { ok: true };
    }

    const egenskap = type.egenskapstyper.find((e) => e.id === endring.egenskapstypeId);
    if (
      !egenskap ||
      SKJULTE_EGENSKAPSTYPER.has(egenskap.egenskapstype) ||
      egenskap.egenskapstype === "Geometri" ||
      egenskap.viktighet === "HISTORISK"
    ) {
      return { ok: false, feil: "Egenskapen hører ikke til denne vegobjekttypen." };
    }

    const felt =
      endring.type === "kreves"
        ? { kreves: endring.kreves }
        : { beskrivelse: endring.beskrivelse || null };

    await db
      .insert(egenskapskrav)
      .values({
        vegobjekttypeId: endring.vegobjekttypeId,
        egenskapstypeId: endring.egenskapstypeId,
        ...felt,
        oppdatertAv: brukerId,
      })
      .onConflictDoUpdate({
        target: [egenskapskrav.vegobjekttypeId, egenskapskrav.egenskapstypeId],
        set: { ...felt, oppdatert: sql`now()`, oppdatertAv: brukerId },
      });
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, feil: "Kunne ikke lagre. Prøv igjen." };
  }
}
