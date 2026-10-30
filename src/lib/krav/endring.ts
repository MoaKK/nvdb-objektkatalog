import { z } from "zod";
import type { Kravdata } from "@/lib/krav/typer";

// Delt mellom klient og server. Serveren validerer alltid på nytt.
export const BESKRIVELSE_MAKS = 1000;

const id = z.number().int().positive().max(9_999_999);

// strictObject: ukjente felt avvises, så ingenting ekstra kan smugles inn
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
    beskrivelse: z
      .string()
      .transform((s) => s.replace(/\r\n/g, "\n").trim())
      .pipe(z.string().max(BESKRIVELSE_MAKS)),
  }),
  z.strictObject({
    type: z.literal("fkb"),
    vegobjekttypeId: id,
    fkb: z.boolean(),
  }),
]);

export type Kravendring = z.input<typeof kravendringSchema>;

// Brukes til å vise endringen med en gang, før serveren har svart
export function anvendEndring(data: Kravdata | undefined, endring: Kravendring): Kravdata {
  const d = data ?? { fkb: false, egenskaper: {} };
  if (endring.type === "fkb") return { ...d, fkb: endring.fkb };

  const nokkel = String(endring.egenskapstypeId);
  const naa = d.egenskaper[nokkel] ?? { kreves: false, beskrivelse: null };
  const ny =
    endring.type === "kreves"
      ? { ...naa, kreves: endring.kreves }
      : { ...naa, beskrivelse: endring.beskrivelse.trim() || null };

  return { ...d, egenskaper: { ...d.egenskaper, [nokkel]: ny } };
}
