"use client";

import Link from "next/link";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type UIEvent,
} from "react";
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
import { lagreScroll, lagreTilstand, lesScroll, lesTilstand } from "@/lib/sidemeny-lagring";

// Faste bredder: SidebarMenuSkeleton bruker Math.random(), som cacheComponents ikke tillater
const SKJELETT_BREDDER = ["w-3/4", "w-1/2", "w-2/3", "w-4/5", "w-3/5", "w-2/3", "w-1/2", "w-3/4"];

export function AppSidebar() {
  const indeks = useSokeindeks();
  const [valg, setValg] = useState<Sokevalg>(STANDARD_SOKEVALG);
  const [apne, setApne] = useState<string[]>([]);
  const [hentetLagret, setHentetLagret] = useState(false);
  const innholdRef = useRef<HTMLDivElement>(null);
  const scrollGjenopprettet = useRef(false);
  const utsattValg = useDeferredValue(valg);

  // Leses etter første render, ellers blir HTML fra server og klient ulik
  useEffect(() => {
    const lagret = lesTilstand();
    if (lagret) {
      setValg(lagret.valg);
      setApne(lagret.apne);
    }
    setHentetLagret(true);
  }, []);

  useEffect(() => {
    if (hentetLagret) lagreTilstand({ valg, apne });
  }, [valg, apne, hentetLagret]);

  // Scroll tilbake når lista er lastet og kategoriene har rukket å åpne seg
  useEffect(() => {
    if (!hentetLagret || !indeks.data || scrollGjenopprettet.current) return;
    const top = lesScroll();
    if (top === 0) {
      scrollGjenopprettet.current = true;
      return;
    }
    const timer = setTimeout(() => {
      innholdRef.current?.scrollTo({ top });
      scrollGjenopprettet.current = true;
    }, 300);
    return () => clearTimeout(timer);
  }, [hentetLagret, indeks.data]);

  function vedScroll(e: UIEvent<HTMLDivElement>) {
    // Ikke overskriv lagret posisjon før den er gjenopprettet
    if (scrollGjenopprettet.current) lagreScroll(e.currentTarget.scrollTop);
  }

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

      <SidebarContent ref={innholdRef} onScroll={vedScroll}>
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
      <SidebarRail className="after:bg-sidebar-border" />
    </Sidebar>
  );
}