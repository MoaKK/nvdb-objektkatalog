"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSokeindeks } from "@/hooks/use-nvdb";

export function AppSidebar() {
  const indeks = useSokeindeks();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <Link href="/" className="font-semibold">
          NVDB Objektkatalog
        </Link>
        <span className="text-xs text-muted-foreground">Registreringskrav for fylkesveg</span>
      </SidebarHeader>
      <SidebarContent className="p-4 text-sm text-muted-foreground">
        {indeks.isPending && "Henter vegobjekttyper..."}
        {indeks.isError && "Kunne ikke hente vegobjekttyper."}
        {indeks.data && `${indeks.data.length} vegobjekttyper lastet.`}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}