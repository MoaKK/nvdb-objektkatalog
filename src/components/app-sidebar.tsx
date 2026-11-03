"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type UIEvent,
} from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { KategoriListe } from "@/components/sidebar/kategori-liste";
import { ObjekttypeFiltre } from "@/components/sidebar/objekttype-filtre";
import { useElektro } from "@/hooks/use-elektro";
import { useKravoversikt } from "@/hooks/use-krav";
import { useSokeindeks } from "@/hooks/use-nvdb";
import { authClient } from "@/lib/auth-client";
import { DATAKATEGORIER } from "@/lib/nvdb/kategori";
import {
  STANDARD_SOKEVALG,
  sokVegobjekttyper,
  type Sokegrupper,
  type Sokevalg,
} from "@/lib/nvdb/sok";
import { lagreScroll, lagreTilstand, lesScroll, lesTilstand } from "@/lib/sidemeny-lagring";

const SKJELETT_BREDDER = ["w-3/4", "w-1/2", "w-2/3", "w-4/5", "w-3/5", "w-2/3", "w-1/2", "w-3/4"];
const VIS_TIL_TOPPEN_ETTER = 400;

function ingenAbonnement() {
  return () => {};
}

export function AppSidebar() {
  const indeks = useSokeindeks();
  const { data: sesjon, isPending: sesjonLaster } = authClient.useSession();
  const begrenset = !sesjonLaster && !sesjon;
  const medKrav = useKravoversikt();
  const { erElektro } = useElektro();
  const [valg, setValg] = useState<Sokevalg>(STANDARD_SOKEVALG);
  const [apne, setApne] = useState<string[]>([]);
  const [hentetLagret, setHentetLagret] = useState(false);
  const [visTilToppen, setVisTilToppen] = useState(false);
  const innholdRef = useRef<HTMLDivElement>(null);
  const scrollGjenopprettet = useRef(false);
  const utsattValg = useDeferredValue(valg);
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  const sokNokkel = `${utsattValg.tekst}|${utsattValg.kategoriId}|${utsattValg.iEgenskaper}|${utsattValg.iVerdier}`;
  const [lukketISok, setLukketISok] = useState<{ nokkel: string; ider: string[] }>({
    nokkel: "",
    ider: [],
  });

  const erINettleseren = useSyncExternalStore(
    ingenAbonnement,
    () => true,
    () => false,
  );

  if (erINettleseren && !hentetLagret) {
    setHentetLagret(true);
    const lagret = lesTilstand();
    if (lagret) {
      setValg(lagret.valg);
      setApne(lagret.apne);
    }
  }

  useEffect(() => {
    if (hentetLagret) lagreTilstand({ valg, apne });
  }, [valg, apne, hentetLagret]);

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

  useEffect(() => {
    if (!isMobile || !openMobile) return;
    const timer = setTimeout(() => {
      innholdRef.current?.scrollTo({ top: lesScroll() });
    }, 50);
    return () => clearTimeout(timer);
  }, [isMobile, openMobile]);

  function vedScroll(e: UIEvent<HTMLDivElement>) {
    const top = e.currentTarget.scrollTop;
    setVisTilToppen(top > VIS_TIL_TOPPEN_ETTER);
    if (scrollGjenopprettet.current) lagreScroll(top);
  }

  function holdPlassVedLukking(kategoriId: string) {
    const container = innholdRef.current;
    const element = container?.querySelector<HTMLElement>(`[data-kategori="${kategoriId}"]`);
    if (!container || !element) return;
    const avstand = element.getBoundingClientRect().top - container.getBoundingClientRect().top;
    if (avstand < 0) container.scrollTop += avstand;
  }

  const grupper = useMemo(() => {
    const alle = sokVegobjekttyper(indeks.data ?? [], utsattValg);
    if (!begrenset) return alle;
    const tillatte = new Set(medKrav.data?.medKrav ?? []);
    return Object.fromEntries(
      Object.entries(alle).map(([kategori, liste]) => [
        kategori,
        liste.filter((r) => tillatte.has(r.type.id)),
      ]),
    ) as Sokegrupper;
  }, [indeks.data, utsattValg, begrenset, medKrav.data]);

  const laster = indeks.isPending || sesjonLaster || (begrenset && medKrav.isPending);
  const harFeil = indeks.isError || (begrenset && medKrav.isError);
  const filtrerer = utsattValg.tekst.trim().length > 0 || utsattValg.kategoriId !== null;
  const kategorierMedTreff = DATAKATEGORIER.filter((k) => grupper[k.id].length > 0);
  const synligeKategorier = filtrerer || begrenset ? kategorierMedTreff : DATAKATEGORIER;
  const antallTreff = kategorierMedTreff.reduce((sum, k) => sum + grupper[k.id].length, 0);

  const lukketNa = lukketISok.nokkel === sokNokkel ? lukketISok.ider : [];
  const apneKategorier = filtrerer
    ? kategorierMedTreff.map((k) => k.id).filter((id) => !lukketNa.includes(id))
    : apne;

  function endreApne(nye: string[]) {
    if (filtrerer) {
      setLukketISok({
        nokkel: sokNokkel,
        ider: kategorierMedTreff.map((k) => k.id).filter((id) => !nye.includes(id)),
      });
    } else {
      setApne(nye);
    }
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="gap-3 border-b p-4">
        <Link
          href="/"
          className="font-semibold leading-tight"
          title="Til forsiden"
          onClick={() => {
            if (isMobile) setOpenMobile(false);
          }}
        >
          NVDB Objektkatalog
          <span className="block text-xs font-normal text-muted-foreground">
            Krav til innlevering av data
          </span>
        </Link>
        <ObjekttypeFiltre valg={valg} onChange={setValg} />
      </SidebarHeader>

      <SidebarContent ref={innholdRef} onScroll={vedScroll}>
        <SidebarGroup>
          {laster && !harFeil && (
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

          {!indeks.isError && begrenset && medKrav.isError && (
            <Alert variant="destructive">
              <AlertDescription>Kunne ikke hente hvilke objekttyper som har krav.</AlertDescription>
            </Alert>
          )}

          {!laster &&
            !harFeil &&
            (antallTreff === 0 && (filtrerer || begrenset) ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>{filtrerer ? "Ingen treff" : "Ingen objekttyper ennå"}</EmptyTitle>
                  <EmptyDescription>
                    {filtrerer
                      ? "Prøv et annet søkeord, eller søk også i egenskapstyper og tillatte verdier."
                      : "Geodata har ikke lagt inn registreringskrav for noen objekttyper ennå."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <KategoriListe
                erElektro={erElektro}
                grupper={grupper}
                kategorier={synligeKategorier}
                apne={apneKategorier}
                onApneChange={endreApne}
                onLukket={holdPlassVedLukking}
              />
            ))}
        </SidebarGroup>
      </SidebarContent>

      {visTilToppen && (
        <SidebarFooter className="border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            title="Gå til toppen av lista"
            onClick={() => innholdRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp />
            Til toppen
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}