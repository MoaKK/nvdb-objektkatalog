import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BeskrivelseRedigerer } from "@/components/objekttype/beskrivelse-redigerer";
import { UtvidbarTekst } from "@/components/objekttype/utvidbar-tekst";
import { ViktighetBadge } from "@/components/viktighet-badge";
import type { Kravdata } from "@/lib/krav/typer";
import { SKJULTE_EGENSKAPSTYPER, type Egenskapstype } from "@/lib/nvdb/schemas";

const PAKREVD = new Set(["PÅKREVD_ABSOLUTT", "PÅKREVD_IKKE_ABSOLUTT"]);

interface Props {
  egenskaper: Egenskapstype[];
  krav?: Kravdata["egenskaper"];
  kanRedigere?: boolean;
  visNvdbBeskrivelse?: boolean;
  visNvdbKrav?: boolean;
  visAlleEgenskaper?: boolean;
  onKreves?: (egenskapstypeId: number, kreves: boolean) => void;
  onBeskrivelse?: (egenskapstypeId: number, beskrivelse: string) => Promise<void>;
}

export function EgenskapTabell({
  egenskaper,
  krav,
  kanRedigere = false,
  visNvdbBeskrivelse = false,
  visNvdbKrav = false,
  visAlleEgenskaper = false,
  onKreves,
  onBeskrivelse,
}: Props) {
  const lagreBeskrivelse = (id: number) => (tekst: string) =>
    onBeskrivelse ? onBeskrivelse(id, tekst) : Promise.resolve();

  const synlige = egenskaper
    .filter(
      (e) =>
        !SKJULTE_EGENSKAPSTYPER.has(e.egenskapstype) &&
        e.egenskapstype !== "Geometri" &&
        e.viktighet !== "HISTORISK" &&
        (kanRedigere ||
          visAlleEgenskaper ||
          PAKREVD.has(e.viktighet) ||
          krav?.[String(e.id)]?.kreves === true ||
          !!krav?.[String(e.id)]?.beskrivelse),
    )
    .sort((a, b) => (a.sorteringsnummer ?? 0) - (b.sorteringsnummer ?? 0));

  return (
    <Table className="border md:table-fixed [&_tr>*:first-child]:border-r md:[&_tr>*:nth-child(2)]:border-r">
      <TableHeader className="[&_th]:underline [&_th]:underline-offset-4">
        <TableRow className="border-b-2 hover:bg-transparent">
          <TableHead className="md:w-[40%]" title="Egenskapstypene i NVDB, med NVDB sitt krav">
            Egenskaper
          </TableHead>
          <TableHead
            className="w-16 text-center md:w-40"
            title="Vegavdelingens krav: om egenskapen må være med ved innlevering"
          >
            <span className="md:hidden">Krav</span>
            <span className="hidden md:inline">Krav til innlevering</span>
          </TableHead>
          <TableHead className="hidden md:table-cell" title="Vegavdelingens kommentar til egenskapen">
            Kommentar
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableCaption className="text-left">
        {kanRedigere
          ? "Som admin ser du alle egenskaper. Andre ser bare de som er påkrevd i NVDB, krysset av eller har en kommentar."
          : visAlleEgenskaper
            ? "Viser alle egenskaper."
            : "Viser egenskaper som er påkrevd i NVDB, eller som geodata har krysset av eller kommentert."}
      </TableCaption>
      <TableBody>
        {synlige.length === 0 && (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={3} className="py-6 text-center whitespace-normal text-muted-foreground">
              Ingen egenskaper er påkrevd, krysset av eller kommentert for denne objekttypen.
            </TableCell>
          </TableRow>
        )}
        {synlige.map((e) => {
          const k = krav?.[String(e.id)];
          return (
            <TableRow key={e.id}>
              <TableCell className="align-top whitespace-normal wrap-break-word">
                <span className="flex flex-wrap items-center gap-2 font-medium">
                  {e.navn}
                  {visNvdbKrav && (
                    <ViktighetBadge viktighet={e.viktighet} forklaring={e.veiledning} />
                  )}
                </span>
                {visNvdbBeskrivelse && e.beskrivelse && (
                  <span className="mt-1 block text-xs text-muted-foreground">
                    <UtvidbarTekst tekst={e.beskrivelse} hva="NVDB sin beskrivelse" />
                  </span>
                )}
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
                  title={
                    kanRedigere
                      ? `Marker om ${e.navn} må være med ved innlevering`
                      : `${e.navn}: ${k?.kreves ? "må være med ved innlevering" : "ikke krav til innlevering"}`
                  }
                />
              </TableCell>
              <TableCell className="hidden align-top whitespace-normal wrap-anywhere md:table-cell">
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
