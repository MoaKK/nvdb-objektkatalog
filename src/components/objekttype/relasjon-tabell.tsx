import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RelasjonMedStatus } from "@/lib/nvdb/schemas";

const RELASJONSTYPE_TEKST: Record<string, string> = {
  KOMPOSISJON: "Komposisjon",
  AGGREGERING: "Aggregering",
  ASSOSIASJON: "Assosiasjon",
};

interface Props {
  relasjoner: RelasjonMedStatus[];
  tomTekst: string;
}

export function RelasjonTabell({ relasjoner, tomTekst }: Props) {
  if (relasjoner.length === 0) {
    return <p className="text-sm text-muted-foreground">{tomTekst}</p>;
  }

  const sortert = [...relasjoner].sort((a, b) =>
    (a.innhold.type.navn ?? "").localeCompare(b.innhold.type.navn ?? "", "nb"),
  );

  return (
    <Table>
      {/* Understreket overskrift og tykkere skillelinje skiller kolonnenavn fra radene */}
      <TableHeader className="[&_th]:underline [&_th]:underline-offset-4">
        <TableRow className="border-b-2 hover:bg-transparent">
          <TableHead>Navn</TableHead>
          <TableHead className="w-20">Nummer</TableHead>
          <TableHead className="hidden sm:table-cell">Relasjon</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortert.map((r) => {
          const { id, navn } = r.innhold.type;
          const visningsnavn = navn ?? `Type ${id}`;
          return (
            <TableRow key={r.id}>
              <TableCell className="whitespace-normal">
                {r.finnes ? (
                  <Link
                    href={`/objekttyper/${id}`}
                    prefetch={false}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {visningsnavn}
                  </Link>
                ) : (
                  <span className="text-muted-foreground" title="Finnes ikke i datakatalogen">
                    {visningsnavn}
                  </span>
                )}
              </TableCell>
              <TableCell className="font-mono text-muted-foreground">{id}</TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {RELASJONSTYPE_TEKST[r.innhold.relasjonstype ?? ""] ?? r.innhold.relasjonstype}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
