"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ELEKTRO_FARGE } from "@/lib/nvdb/elektro";
import type { Sokeresultat } from "@/lib/nvdb/sok";
import { cn } from "@/lib/utils";

interface Props {
  resultater: Sokeresultat[];
  erElektro?: (id: number, kategorier: number[]) => boolean;
  etikettKlasse?: string;
}

export function ObjekttypeMeny({ resultater, erElektro, etikettKlasse }: Props) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <>
      <SidebarGroupLabel
        className={cn("justify-between underline underline-offset-4", etikettKlasse)}
      >
        <span title="Navnet på vegobjekttypen">Navn</span>
        <span title="Vegobjekttypens nummer i NVDB">Nummer</span>
      </SidebarGroupLabel>
      <SidebarMenu className="[&_a]:no-underline">
        {resultater.map(({ type, treff }) => {
          const href = `/objekttyper/${type.id}`;
          const elektro = erElektro?.(type.id, type.kategorier) ?? false;
          return (
            <SidebarMenuItem key={type.id}>
              <SidebarMenuButton
                render={<Link href={href} prefetch={false} />}
                isActive={pathname === href}
                title={`${type.navn} (nummer ${type.id})${elektro ? ". Elektro-objekt" : ""}${treff ? `. ${treff}` : ""}`}
                onClick={() => {
                  if (isMobile) setOpenMobile(false);
                }}
                className={treff ? "h-auto flex-col items-start gap-0 py-1.5 pr-12" : "pr-12"}
              >
                <span className={cn("w-full truncate", elektro && ELEKTRO_FARGE)}>
                  {type.navn}
                </span>
                {treff && (
                  <span className="w-full truncate text-xs text-muted-foreground">{treff}</span>
                )}
              </SidebarMenuButton>
              <SidebarMenuBadge>{type.id}</SidebarMenuBadge>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </>
  );
}
