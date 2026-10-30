import { z } from "zod";
import type { Kravdata } from "@/lib/krav/typer";

export const BESKRIVELSE_MAKS = 1000;

const id = z.number().int().positive().max(9_999_999);

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
