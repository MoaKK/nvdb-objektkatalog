import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BeskrivelseRedigerer } from "@/components/objekttype/beskrivelse-redigerer";
import { ViktighetBadge } from "@/components/viktighet-badge";
import type { Kravdata } from "@/lib/krav/typer";
import { SKJULTE_EGENSKAPSTYPER, type Egenskapstype } from "@/lib/nvdb/schemas";

interface Props {
  egenskaper: Egenskapstype[];
  // Vegavdelingens krav fra databasen, nøkkel er egenskapstype-id
  krav?: Kravdata["egenskaper"];
  // Bare sann for innlogget admin. Serveren sjekker uansett på nytt ved lagring.
  kanRedigere?: boolean;
  // NVDB sin beskrivelse under navnet. Av som standard for å holde tabellen kort.
  visNvdbBeskrivelse?: boolean;
  onKreves?: (egenskapstypeId: number, kreves: boolean) => void;
  onBeskrivelse?: (egenskapstypeId: number, beskrivelse: string) => Promise<void>;
}

export function EgenskapTabell({
  egenskaper,
  krav,
  kanRedigere = false,
  visNvdbBeskrivelse = false,
  onKreves,
  onBeskrivelse,
}: Props) {
  const lagreBeskrivelse = (id: number) => (tekst: string) =>
    onBeskrivelse ? onBeskrivelse(id, tekst) : Promise.resolve();

  const synlige = egenskaper
    .filter(
      (e) =>
        !SKJULTE_EGENSKAPSTYPER.has(e.egenskapstype) &&
        // Geometri vises med nøyaktighetskrav i kortet øverst
        e.egenskapstype !== "Geometri" &&
        e.viktighet !== "HISTORISK",
    )
    .sort((a, b) => (a.sorteringsnummer ?? 0) - (b.sorteringsnummer ?? 0));

  return (
    <Table>
      {/* Understreket overskrift og tykkere skillelinje skiller kolonnenavn fra radene */}
      <TableHeader className="[&_th]:underline [&_th]:underline-offset-4">
        <TableRow className="border-b-2 hover:bg-transparent">
          <TableHead>Egenskaper</TableHead>
          <TableHead className="w-16 text-center md:w-40">
            <span className="md:hidden">Krav</span>
            <span className="hidden md:inline">Krav til innlevering</span>
          </TableHead>
          {/* Kommentar skjules på mobil så navn og avkrysning får plass */}
          <TableHead className="hidden md:table-cell">Kommentar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {synlige.map((e) => {
          const k = krav?.[String(e.id)];
          return (
            <TableRow key={e.id}>
              <TableCell className="align-top whitespace-normal md:max-w-sm">
                <span className="flex flex-wrap items-center gap-2 font-medium">
                  {e.navn}
                  <ViktighetBadge viktighet={e.viktighet} forklaring={e.veiledning} />
                </span>
                {visNvdbBeskrivelse && e.beskrivelse && (
                  <span
                    className="mt-1 line-clamp-3 block text-xs text-muted-foreground md:line-clamp-2"
                    title={e.beskrivelse}
                  >
                    {e.beskrivelse}
                  </span>
                )}
                {/* På mobil er Kommentar-kolonnen skjult, så den vises under navnet */}
                {(k?.beskrivelse || kanRedigere) && (
                  <span className="mt-2 block md:hidden">
                    <BeskrivelseRedigerer
                      verdi={k?.beskrivelse ?? null}
                      navn={e.navn}
                      kanRedigere={kanRedigere}
                      onLagre={lagreBeskrivelse(e.id)}
                    />
                  </span>
                )}
              </TableCell>
              <TableCell className="align-top">
                <Checkbox
                  disabled={!kanRedigere}
                  checked={k?.kreves ?? false}
                  onCheckedChange={(c) => onKreves?.(e.id, c === true)}
                  className="mx-auto"
                  aria-label={`Krav til innlevering: ${e.navn}`}
                />
              </TableCell>
              <TableCell className="hidden align-top whitespace-normal md:table-cell">
                <BeskrivelseRedigerer
                  verdi={k?.beskrivelse ?? null}
                  navn={e.navn}
                  kanRedigere={kanRedigere}
                  onLagre={lagreBeskrivelse(e.id)}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
