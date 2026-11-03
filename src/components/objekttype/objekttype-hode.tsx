"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { DatakategoriBadge } from "@/components/datakategori-badge";
import { BeskrivelseRedigerer } from "@/components/objekttype/beskrivelse-redigerer";
import { VegkartLenker } from "@/components/objekttype/vegkart-lenker";
import { ViktighetBadge } from "@/components/viktighet-badge";
import { useKategorier } from "@/hooks/use-nvdb";
import { TILLEGGSINFORMASJON_MAKS } from "@/lib/krav/endring";
import { ELEKTRO_FARGE } from "@/lib/nvdb/elektro";
import { cn } from "@/lib/utils";
import type { Egenskapstype, VegobjekttypeDetaljer } from "@/lib/nvdb/schemas";

const GEOMETRI_TEKST: Record<string, string> = {
  PUNKT: "punkt",
  LINJE: "linje",
  POLYGON: "flate",
};

const ALLE_KATEGORIER_ID = 38;

const PAKREVD = new Set(["PÅKREVD_ABSOLUTT", "PÅKREVD_IKKE_ABSOLUTT"]);

const REKKEFOLGE = ["PÅKREVD_ABSOLUTT", "PÅKREVD_IKKE_ABSOLUTT", "BETINGET", "OPSJONELL", "MINDRE_VIKTIG"];

function viktighetsrekkefolge(viktighet: string) {
  const plass = REKKEFOLGE.indexOf(viktighet);
  return plass === -1 ? REKKEFOLGE.length : plass;
}

function iCm(meter?: number | null) {
  return meter ? `${Math.round(meter * 100)} cm` : null;
}

function Innmaling({ geometri }: { geometri: Egenskapstype }) {
  const form = GEOMETRI_TEKST[geometri.geometritype ?? ""] ?? geometri.navn.toLowerCase();
  const horisontalt = iCm(geometri.nøyaktighetskrav_grunnriss);
  const vertikalt = geometri.dimensjoner === 2 ? null : iCm(geometri.nøyaktighetskrav_høyde);

  return (
    <li className="flex flex-col gap-1 rounded-lg border p-3">
      <span className="flex flex-wrap items-center gap-2 font-medium">
        {PAKREVD.has(geometri.viktighet) ? "Skal" : "Kan"} måles inn som {form}
        <ViktighetBadge viktighet={geometri.viktighet} forklaring={geometri.veiledning} />
      </span>
      {(horisontalt || vertikalt) && (
        <span className="text-muted-foreground">
          Nøyaktighetskrav:
          {horisontalt && ` horisontalt ${horisontalt}`}
          {horisontalt && vertikalt && ","}
          {vertikalt && ` vertikalt ${vertikalt}`}
        </span>
      )}
    </li>
  );
}

interface Props {
  type: VegobjekttypeDetaljer;
  fkb?: boolean;
  fkbKommentar?: string | null;
  kanRedigere?: boolean;
  onFkb?: (fkb: boolean) => void;
  onFkbKommentar?: (kommentar: string) => Promise<void>;
  tilleggsinformasjon?: string | null;
  onTilleggsinformasjon?: (tekst: string) => Promise<void>;
  elektro?: boolean;
}

export function ObjekttypeHode({
  type,
  fkb = false,
  fkbKommentar = null,
  kanRedigere = false,
  onFkb,
  onFkbKommentar,
  tilleggsinformasjon = null,
  onTilleggsinformasjon,
  elektro = false,
}: Props) {
  const kategorier = useKategorier();
  const kategoriNavn = new Map((kategorier.data ?? []).map((k) => [k.id, k.navn]));
  const typekategorier = (type.kategorier ?? [])
    .map((k) => k.id)
    .filter((id) => id !== ALLE_KATEGORIER_ID);

  const alleGeometrier = type.egenskapstyper
    .filter((e) => e.egenskapstype === "Geometri" && e.viktighet !== "HISTORISK")
    .sort(
      (a, b) =>
        viktighetsrekkefolge(a.viktighet) - viktighetsrekkefolge(b.viktighet) ||
        (a.sorteringsnummer ?? 0) - (b.sorteringsnummer ?? 0),
    );
  const pakrevdeGeometrier = alleGeometrier.filter((g) => PAKREVD.has(g.viktighet));
  const geometrier = pakrevdeGeometrier.length > 0 ? pakrevdeGeometrier : alleGeometrier;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xl md:text-2xl">
          <span className={cn(elektro && ELEKTRO_FARGE)} title={elektro ? "Elektro-objekt" : undefined}>
            {type.navn}
          </span>
          <span
            className="font-mono text-lg text-muted-foreground md:text-xl"
            title="Vegobjekttypens nummer i NVDB"
          >
            {type.id}
          </span>
        </CardTitle>
        {type.beskrivelse && (
          <CardDescription className="text-sm md:text-base">{type.beskrivelse}</CardDescription>
        )}
        <CardAction>
          <VegkartLenker id={type.id} navn={type.navn} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        <span className="flex flex-col gap-2">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-medium">Hovedkategori:</span>
            <DatakategoriBadge hovedkategori={type.hovedkategori} />
          </span>
          {typekategorier.length > 0 && (
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-medium">Vegobjekttypekategori:</span>
              {typekategorier.map((id) => {
                const navn = kategoriNavn.get(id) ?? `Kategori ${id}`;
                return (
                  <Badge key={id} variant="secondary" title={`Vegobjekttypekategori i NVDB: ${navn}`}>
                    {navn}
                  </Badge>
                );
              })}
            </span>
          )}
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-medium">Morobjekt:</span>
            {type.må_ha_mor ? (
              <Badge variant="outline" title="Objektet må knyttes til et morobjekt i NVDB">
                Må ha morobjekt
              </Badge>
            ) : (
              <Badge variant="outline" title="Objektet kan registreres uten morobjekt i NVDB">
                Trenger ikke morobjekt
              </Badge>
            )}
          </span>
        </span>
        {type.veiledning && <p className="text-muted-foreground">{type.veiledning}</p>}
      <Separator />

        <span className="flex flex-col gap-2">
          <Field
            orientation="horizontal"
            title={
              kanRedigere
                ? "Marker om vegobjekttypen skal registreres i FKB"
                : fkb
                  ? "Skal registreres i FKB"
                  : "Skal ikke registreres i FKB"
            }
          >
            <Checkbox
              id="fkb"
              disabled={!kanRedigere}
              checked={fkb}
              onCheckedChange={(c) => onFkb?.(c === true)}
            />
            <FieldLabel htmlFor="fkb" className="font-normal">
              Skal registreres i FKB
            </FieldLabel>
          </Field>
          {(fkbKommentar || kanRedigere) && (
            <span className="block pl-6">
              <BeskrivelseRedigerer
                verdi={fkbKommentar}
                navn="FKB"
                kanRedigere={kanRedigere}
                onLagre={onFkbKommentar ?? (() => Promise.resolve())}
              />
          </span>
        )}
        </span>

        {geometrier.length > 0 && (
          <>
            <Separator />
            <span className="flex flex-col gap-2">
              <span className="font-medium">Innmåling</span>
              <ul className="grid gap-2 sm:grid-cols-2">
                {geometrier.map((g) => (
                  <Innmaling key={g.id} geometri={g} />
                ))}
              </ul>
            </span>
          </>
        )}

        {(tilleggsinformasjon || kanRedigere) && (
          <>
            <Separator />
            <span className="flex flex-col gap-2">
              <span className="font-medium">Tilleggsinformasjon fra Geodata</span>
              <BeskrivelseRedigerer
                verdi={tilleggsinformasjon}
                navn={type.navn}
                kanRedigere={kanRedigere}
                etikett="tilleggsinformasjon"
                maks={TILLEGGSINFORMASJON_MAKS}
                onLagre={onTilleggsinformasjon ?? (() => Promise.resolve())}
              />
            </span>
          </>
        )}
      </CardContent>
    </Card>
  );
}
