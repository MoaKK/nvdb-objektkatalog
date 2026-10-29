"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { KategoriListe } from "@/components/sidebar/kategori-liste";
import { ObjekttypeFiltre } from "@/components/sidebar/objekttype-filtre";
import { useSokeindeks } from "@/hooks/use-nvdb";
import { DATAKATEGORIER } from "@/lib/nvdb/kategori";
import { STANDARD_SOKEVALG, sokVegobjekttyper, type Sokevalg } from "@/lib/nvdb/sok";

// Faste bredder: SidebarMenuSkeleton bruker Math.random(), som cacheComponents ikke tillater
const SKJELETT_BREDDER = ["w-3/4", "w-1/2", "w-2/3", "w-4/5", "w-3/5", "w-2/3", "w-1/2", "w-3/4"];

export function AppSidebar() {
  const indeks = useSokeindeks();
  const [valg, setValg] = useState<Sokevalg>(STANDARD_SOKEVALG);
  const [apne, setApne] = useState<string[]>([]);
  const utsattValg = useDeferredValue(valg);

  const grupper = useMemo(
    () => sokVegobjekttyper(indeks.data ?? [], utsattValg),
    [indeks.data, utsattValg],
  );

  const filtrerer = utsattValg.tekst.trim().length > 0 || utsattValg.kategoriId !== null;
  const antallTreff = DATAKATEGORIER.reduce((sum, k) => sum + grupper[k.id].length, 0);
  const apneKategorier = filtrerer
    ? DATAKATEGORIER.filter((k) => grupper[k.id].length > 0).map((k) => k.id)
    : apne;

  return (
    <Sidebar>
      <SidebarHeader className="gap-3 border-b p-4">
        <Link href="/" className="font-semibold leading-tight">
          NVDB Objektkatalog
          <span className="block text-xs font-normal text-muted-foreground">
            Registreringskrav for fylkesveg
          </span>
        </Link>
        <ObjekttypeFiltre valg={valg} onChange={setValg} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {indeks.isPending && (
            <SidebarMenu>
              {SKJELETT_BREDDER.map((bredde, i) => (
                <SidebarMenuItem key={i} className="px-2 py-1.5">
                  <Skeleton className={`h-4 ${bredde}`} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}

          {indeks.isError && (
            <Alert variant="destructive">
              <AlertDescription>Kunne ikke hente vegobjekttyper fra NVDB.</AlertDescription>
            </Alert>
          )}

          {indeks.data &&
            (antallTreff === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>Ingen treff</EmptyTitle>
                  <EmptyDescription>
                    Prøv et annet søkeord, eller søk også i egenskapstyper og tillatte verdier.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <KategoriListe
                grupper={grupper}
                apne={apneKategorier}
                onApneChange={(v) => {
                  if (!filtrerer) setApne(v);
                }}
              />
            ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}