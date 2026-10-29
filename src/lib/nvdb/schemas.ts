import { z } from "zod";

export const VIKTIGHET_TEKST: Record<string, string> = {
  PÅKREVD_ABSOLUTT: "Påkrevd (absolutt)",
  PÅKREVD_IKKE_ABSOLUTT: "Påkrevd (ikke absolutt)",
  BETINGET: "Betinget",
  OPSJONELL: "Opsjonell",
  MINDRE_VIKTIG: "Mindre viktig",
  HISTORISK: "Historisk",
  IKKE_SATT: "Ikke satt",
};

export const tillattVerdiSchema = z.object({
  id: z.number(),
  verdi: z.union([z.string(), z.number()]).nullish(),
  kortnavn: z.string().nullish(),
});

export const egenskapstypeSchema = z.object({
  id: z.number(),
  navn: z.string(),
  beskrivelse: z.string().nullish(),
  egenskapstype: z.string(),
  viktighet: z
    .string()
    .nullish()
    .transform((v) => v ?? "IKKE_SATT"),
  sorteringsnummer: z.number().nullish(),
  tillatte_verdier: z.array(tillattVerdiSchema).nullish(),
});

export const relasjonSchema = z.object({
  id: z.number(),
  relasjonstype: z.string().nullish(),
  innenfor_mor: z.string().nullish(),
  min: z.number().nullish(),
  maks: z.number().nullish(),
  type: z.object({
    id: z.number(),
    navn: z.string().nullish(),
  }),
});

export const vegobjekttypeSummarySchema = z.object({
  id: z.number(),
  navn: z.string(),
  beskrivelse: z.string().nullish(),
  status: z.string().nullish(),
});

export const vegobjekttypeDetailSchema = vegobjekttypeSummarySchema.extend({
  veiledning: z.string().nullish(),
  må_ha_mor: z.boolean().nullish(),
  egenskapstyper: z.array(egenskapstypeSchema).default([]),
  relasjonstyper: z
    .object({
      foreldre: z.array(relasjonSchema).default([]),
      barn: z.array(relasjonSchema).default([]),
    })
    .default({ foreldre: [], barn: [] }),
});

export type Egenskapstype = z.infer<typeof egenskapstypeSchema>;
export type Relasjon = z.infer<typeof relasjonSchema>;
export type VegobjekttypeSummary = z.infer<typeof vegobjekttypeSummarySchema>;
export type VegobjekttypeDetail = z.infer<typeof vegobjekttypeDetailSchema>;