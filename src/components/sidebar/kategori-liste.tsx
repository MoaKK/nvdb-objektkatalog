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
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DATAKATEGORIER } from "@/lib/nvdb/kategori";
import type { Sokegrupper } from "@/lib/nvdb/sok";

interface Props {
  grupper: Sokegrupper;
  apne: string[];
  onApneChange: (apne: string[]) => void;
}

export function KategoriListe({ grupper, apne, onApneChange }: Props) {
  const pathname = usePathname();

  return (
    <Accordion type="multiple" value={apne} onValueChange={onApneChange}>
      {DATAKATEGORIER.map((kategori) => (
        <AccordionItem key={kategori.id} value={kategori.id}>
          <AccordionTrigger className="px-2 text-sm hover:no-underline">
            <span className="flex flex-1 items-center justify-between gap-2 pr-2 text-left">
              {kategori.navn}
              <Badge variant="secondary">{grupper[kategori.id].length}</Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <SidebarMenu>
              {grupper[kategori.id].map(({ type, treff }) => {
                const href = `/objekttyper/${type.id}`;
                return (
                  <SidebarMenuItem key={type.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === href}
                      className={treff ? "h-auto flex-col items-start gap-0 py-1.5" : undefined}
                    >
                      <Link href={href}>
                        <span className="w-full truncate">{type.navn}</span>
                        {treff && (
                          <span className="w-full truncate text-xs text-muted-foreground">
                            {treff}
                          </span>
                        )}
                      </Link>
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