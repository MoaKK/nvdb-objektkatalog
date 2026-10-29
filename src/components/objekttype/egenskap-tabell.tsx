import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ViktighetBadge } from "@/components/viktighet-badge";
import { SKJULTE_EGENSKAPSTYPER, type Egenskapstype } from "@/lib/nvdb/schemas";

export function EgenskapTabell({ egenskaper }: { egenskaper: Egenskapstype[] }) {
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
          {/* Beskrivelse skjules på mobil så navn og avkrysning får plass */}
          <TableHead className="hidden md:table-cell">Beskrivelse</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {synlige.map((e) => {
          return (
            <TableRow key={e.id}>
              <TableCell className="align-top whitespace-normal md:max-w-sm">
                <span className="flex flex-wrap items-center gap-2 font-medium">
                  {e.navn}
                  <ViktighetBadge viktighet={e.viktighet} forklaring={e.veiledning} />
                </span>
                {e.beskrivelse && (
                  <span
                    className="mt-1 line-clamp-3 block text-xs text-muted-foreground md:line-clamp-2"
                    title={e.beskrivelse}
                  >
                    {e.beskrivelse}
                  </span>
                )}
              </TableCell>
              <TableCell className="align-top">
                {/* Skrivebeskyttet til databasen og admin-innlogging er på plass */}
                <Checkbox
                  disabled
                  checked={false}
                  className="mx-auto"
                  aria-label={`Krav til innlevering: ${e.navn}`}
                />
              </TableCell>
              <TableCell className="hidden align-top whitespace-normal text-muted-foreground md:table-cell" />
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
