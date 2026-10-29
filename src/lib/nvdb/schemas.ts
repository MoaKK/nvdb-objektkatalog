import { z } from "zod";

export const VIKTIGHET_TEKST: Record<string, string> = {
  PÅKREVD_ABSOLUTT: "Påkrevd (absolutt)",
  PÅKREVD_IKKE_ABSOLUTT: "Påkrevd",
  BETINGET: "Betinget",
  OPSJONELL: "Opsjonell",
  MINDRE_VIKTIG: "Mindre viktig",
  HISTORISK: "Historisk",
  IKKE_SATT: "Ikke satt",
};


export const SKJULTE_EGENSKAPSTYPER = new Set(["Liste"]);

export const tillattVerdiSchema = z.object({
  id: z.number(),
  verdi: z.union([z.string(), z.number()]).nullish(),
  kortnavn: z.string().nullish(),
  sorteringsnummer: z.number().nullish(),
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
  minimalt_antall_verdier: z.number().nullish(),
  maksimalt_antall_verdier: z.number().nullish(),
  innhold: z.object({
    relasjonstype: z.string().nullish(),
    innenfor_mor: z.string().nullish(),
    type: z.object({
      id: z.number(),
      navn: z.string().nullish(),
    }),
  }),
});

const vegobjekttypeBaseSchema = z.object({
  id: z.number(),
  navn: z.string(),
  hovedkategori: z.string().nullish(),
  status: z.string().nullish(),
});


export const vegobjekttypeIndeksSchema = vegobjekttypeBaseSchema
  .extend({
    kategorier: z.array(z.object({ id: z.number() })).nullish(),
    egenskapstyper: z
      .array(
        z.object({
          navn: z.string(),
          egenskapstype: z.string(),
          tillatte_verdier: z
            .array(z.object({ verdi: z.union([z.string(), z.number()]).nullish() }))
            .nullish(),
        }),
      )
      .nullish(),
  })
  .transform((t) => {
    const egenskaper = (t.egenskapstyper ?? []).filter(
      (e) => !SKJULTE_EGENSKAPSTYPER.has(e.egenskapstype),
    );
    return {
      id: t.id,
      navn: t.navn,
      hovedkategori: t.hovedkategori ?? null,
      status: t.status ?? null,
      kategorier: (t.kategorier ?? []).map((k) => k.id),
      egenskaper: egenskaper.map((e) => e.navn),
      verdier: [
        ...new Set(
          egenskaper.flatMap((e) =>
            (e.tillatte_verdier ?? []).flatMap((v) => (v.verdi == null ? [] : [String(v.verdi)])),
          ),
        ),
      ],
    };
  });

export const vegobjekttypeDetailSchema = vegobjekttypeBaseSchema.extend({
  beskrivelse: z.string().nullish(),
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

export const vegobjekttypekategoriSchema = z.object({
  id: z.number(),
  navn: z.string(),
  beskrivelse: z.string().nullish(),
  sorteringsnummer: z.number().nullish(),
});

// Relasjon beriket av serveren med om den relaterte typen finnes i katalogen
export type RelasjonMedStatus = Relasjon & { finnes: boolean };

export type VegobjekttypeDetaljer = Omit<VegobjekttypeDetail, "relasjonstyper"> & {
  relasjonstyper: { foreldre: RelasjonMedStatus[]; barn: RelasjonMedStatus[] };
};

export type Egenskapstype = z.infer<typeof egenskapstypeSchema>;
export type Relasjon = z.infer<typeof relasjonSchema>;
export type VegobjekttypeIndeks = z.infer<typeof vegobjekttypeIndeksSchema>;
export type VegobjekttypeDetail = z.infer<typeof vegobjekttypeDetailSchema>;
export type Vegobjekttypekategori = z.infer<typeof vegobjekttypekategoriSchema>;