"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { SidebarSeparator } from "@/components/ui/sidebar";
import { ObjekttypeMeny } from "@/components/sidebar/objekttype-meny";
import { DATAKATEGORIER } from "@/lib/nvdb/kategori";
import type { Sokegrupper } from "@/lib/nvdb/sok";

interface Props {
  grupper: Sokegrupper;
  apne: string[];
  onApneChange: (apne: string[]) => void;
  kategorier?: typeof DATAKATEGORIER;
  onLukket?: (kategoriId: string) => void;
  erElektro?: (id: number, kategorier: number[]) => boolean;
}

function antallTekst(antall: number) {
  return `${antall} ${antall === 1 ? "objekt" : "objekter"}`;
}

export function KategoriListe({
  grupper,
  apne,
  onApneChange,
  kategorier = DATAKATEGORIER,
  onLukket,
  erElektro,
}: Props) {

  return (
    <Accordion
      multiple
      value={apne}
      onValueChange={(v) => {
        const nye = v as string[];
        const lukket = apne.find((id) => !nye.includes(id));
        if (lukket) onLukket?.(lukket);
        onApneChange(nye);
      }}
    >
      {kategorier.map((kategori) => (
        <AccordionItem
          key={kategori.id}
          value={kategori.id}
          data-kategori={kategori.id}
          className="[&>h3]:sticky [&>h3]:top-0 [&>h3]:z-10 [&>h3]:bg-sidebar"
        >
          <AccordionTrigger
            className="px-2 text-sm hover:no-underline"
            title={`Vis eller skjul ${kategori.navn}`}
          >
            <span className="flex flex-1 items-center justify-between gap-2 pr-2 text-left">
              {kategori.navn}
              <Badge
                variant="secondary"
                title={`${antallTekst(grupper[kategori.id].length)} i ${kategori.navn}`}
              >
                {antallTekst(grupper[kategori.id].length)}
              </Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-2 [&_a]:no-underline">
            <SidebarSeparator className="mx-0 mb-1" />
            <ObjekttypeMeny resultater={grupper[kategori.id]} erElektro={erElektro} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}