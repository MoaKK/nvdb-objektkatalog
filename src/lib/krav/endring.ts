import { z } from "zod";
import type { Kravdata } from "@/lib/krav/typer";

export const BESKRIVELSE_MAKS = 1000;
export const TILLEGGSINFORMASJON_MAKS = 2000;

const id = z.number().int().positive().max(9_999_999);

function tekstOpptil(maks: number) {
  return z
    .string()
    .transform((s) => s.replace(/\r\n/g, "\n").trim())
    .pipe(z.string().max(maks));
}

const tekst = tekstOpptil(BESKRIVELSE_MAKS);

export const kravendringSchema = z.discriminatedUnion("type", [
  z.strictObject({
    type: z.literal("kreves"),
    vegobjekttypeId: id,
    egenskapstypeId: id,
    kreves: z.boolean(),
  }),
  z.strictObject({
    type: z.literal("beskrivelse"),
    vegobjekttypeId: id,
    egenskapstypeId: id,
    beskrivelse: tekst,
  }),
  z.strictObject({
    type: z.literal("fkb"),
    vegobjekttypeId: id,
    fkb: z.boolean(),
  }),
  z.strictObject({
    type: z.literal("fkbKommentar"),
    vegobjekttypeId: id,
    kommentar: tekst,
  }),
  z.strictObject({
    type: z.literal("tilleggsinformasjon"),
    vegobjekttypeId: id,
    tekst: tekstOpptil(TILLEGGSINFORMASJON_MAKS),
  }),
  z.strictObject({
    type: z.literal("elektro"),
    vegobjekttypeId: id,
    elektro: z.boolean(),
  }),
]);

export type Kravendring = z.input<typeof kravendringSchema>;

export function anvendEndring(data: Kravdata | undefined, endring: Kravendring): Kravdata {
  const d = data ?? {
    fkb: false,
    fkbKommentar: null,
    tilleggsinformasjon: null,
    elektro: false,
    egenskaper: {},
  };
  if (endring.type === "fkb") return { ...d, fkb: endring.fkb };
  if (endring.type === "elektro") return { ...d, elektro: endring.elektro };
  if (endring.type === "fkbKommentar") return { ...d, fkbKommentar: endring.kommentar.trim() || null };
  if (endring.type === "tilleggsinformasjon") {
    return { ...d, tilleggsinformasjon: endring.tekst.trim() || null };
  }

  const nokkel = String(endring.egenskapstypeId);
  const naa = d.egenskaper[nokkel] ?? { kreves: false, beskrivelse: null };
  const ny =
    endring.type === "kreves"
      ? { ...naa, kreves: endring.kreves }
      : { ...naa, beskrivelse: endring.beskrivelse.trim() || null };

  return { ...d, egenskaper: { ...d.egenskaper, [nokkel]: ny } };
}
