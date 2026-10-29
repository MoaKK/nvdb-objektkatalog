"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { DATAKATEGORIER } from "@/lib/nvdb/kategori";
import type { Sokegrupper } from "@/lib/nvdb/sok";

interface Props {
  grupper: Sokegrupper;
  apne: string[];
  onApneChange: (apne: string[]) => void;
  // Hvilke kategorier som vises (ved søk skjules de uten treff)
  kategorier?: typeof DATAKATEGORIER;
  // Kalles når brukeren lukker en kategori, så sidemenyen kan holde plassen
  onLukket?: (kategoriId: string) => void;
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
}: Props) {
  const pathname = usePathname();

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
          // Overskriften (h3) blir liggende øverst mens man scroller gjennom kategorien
          className="[&>h3]:sticky [&>h3]:top-0 [&>h3]:z-10 [&>h3]:bg-sidebar"
        >
          <AccordionTrigger className="px-2 text-sm hover:no-underline">
            <span className="flex flex-1 items-center justify-between gap-2 pr-2 text-left">
              {kategori.navn}
              <Badge variant="secondary">{antallTekst(grupper[kategori.id].length)}</Badge>
            </span>
          </AccordionTrigger>
          {/* AccordionContent understreker lenker som standard, det vil vi ikke i menyen */}
          <AccordionContent className="pb-2 [&_a]:no-underline">
            <SidebarSeparator className="mx-0 mb-1" />
            <SidebarGroupLabel className="justify-between underline underline-offset-4">
              <span>Navn</span>
              <span>Nummer</span>
            </SidebarGroupLabel>
            <SidebarMenu>
              {grupper[kategori.id].map(({ type, treff }) => {
                const href = `/objekttyper/${type.id}`;
                return (
                  <SidebarMenuItem key={type.id}>
                    <SidebarMenuButton
                      render={<Link href={href} prefetch={false} />}
                      isActive={pathname === href}
                      className={treff ? "h-auto flex-col items-start gap-0 py-1.5 pr-12" : "pr-12"}
                    >
                      <span className="w-full truncate">{type.navn}</span>
                      {treff && (
                        <span className="w-full truncate text-xs text-muted-foreground">
                          {treff}
                        </span>
                      )}
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{type.id}</SidebarMenuBadge>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}