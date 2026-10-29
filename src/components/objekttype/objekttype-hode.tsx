import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { DatakategoriBadge } from "@/components/datakategori-badge";
import { ViktighetBadge } from "@/components/viktighet-badge";
import type { Egenskapstype, VegobjekttypeDetaljer } from "@/lib/nvdb/schemas";

const GEOMETRI_TEKST: Record<string, string> = {
  PUNKT: "punkt",
  LINJE: "linje",
  POLYGON: "flate",
};

const PAKREVD = new Set(["PÅKREVD_ABSOLUTT", "PÅKREVD_IKKE_ABSOLUTT"]);

// NVDB oppgir nøyaktighetskrav i meter
function iCm(meter?: number | null) {
  return meter ? `${Math.round(meter * 100)} cm` : null;
}

function Innmaling({ geometri }: { geometri: Egenskapstype }) {
  const form = GEOMETRI_TEKST[geometri.geometritype ?? ""] ?? geometri.navn.toLowerCase();
  const horisontalt = iCm(geometri.nøyaktighetskrav_grunnriss);
  // Vertikalt krav gjelder bare 3D-geometri
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
  // Fra vegavdelingens database, ikke NVDB
  fkb?: boolean;
  kanRedigere?: boolean;
  onFkb?: (fkb: boolean) => void;
}

export function ObjekttypeHode({ type, fkb = false, kanRedigere = false, onFkb }: Props) {
  const geometrier = type.egenskapstyper
    .filter((e) => e.egenskapstype === "Geometri" && e.viktighet !== "HISTORISK")
    .sort((a, b) => (a.sorteringsnummer ?? 0) - (b.sorteringsnummer ?? 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xl md:text-2xl">
          {type.navn}
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
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-medium">Hovedkategori:</span>
          <DatakategoriBadge hovedkategori={type.hovedkategori} />
          {type.må_ha_mor && (
            <Badge variant="outline" title="Objektet må knyttes til et morobjekt i NVDB">
              Må ha morobjekt
            </Badge>
          )}
        </span>
        {type.veiledning && <p className="text-muted-foreground">{type.veiledning}</p>}
      <Separator />

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
      </CardContent>
    </Card>
  );
}
