"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSyncExternalStore } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { NvdbNede } from "@/components/nvdb-nede";
import { AdminMeny } from "@/components/objekttype/admin-meny";
import { EgenskapTabell } from "@/components/objekttype/egenskap-tabell";
import { ObjekttypeHode } from "@/components/objekttype/objekttype-hode";
import { RelasjonKort } from "@/components/objekttype/relasjon-kort";
import { useElektro } from "@/hooks/use-elektro";
import { useKrav, useLagreKrav } from "@/hooks/use-krav";
import { useVegobjekttype } from "@/hooks/use-nvdb";
import { erNvdbUtilgjengelig } from "@/lib/nvdb/api-feil";
import { authClient } from "@/lib/auth-client";

export function DetaljerSkjelett() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:gap-6">
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

const VIS_BESKRIVELSE_NOKKEL = "nvdb-vis-nvdb-beskrivelse";
const VIS_KRAV_NOKKEL = "nvdb-vis-nvdb-krav";
const VIS_ALLE_NOKKEL = "nvdb-vis-alle-egenskaper";
const BRYTER_ENDRET = "nvdb-bryter-endret";

const bryterIMinnet = new Map<string, boolean>();

function lesBryter(nokkel: string) {
  try {
    return localStorage.getItem(nokkel) === "1";
  } catch {
    return bryterIMinnet.get(nokkel) ?? false;
  }
}

function abonnerPaaBrytere(varsle: () => void) {
  window.addEventListener("storage", varsle);
  window.addEventListener(BRYTER_ENDRET, varsle);
  return () => {
    window.removeEventListener("storage", varsle);
    window.removeEventListener(BRYTER_ENDRET, varsle);
  };
}

function useLagretBryter(nokkel: string) {
  const paa = useSyncExternalStore(
    abonnerPaaBrytere,
    () => lesBryter(nokkel),
    () => false,
  );

  function endre(ny: boolean) {
    bryterIMinnet.set(nokkel, ny);
    try {
      localStorage.setItem(nokkel, ny ? "1" : "0");
    } catch {}
    window.dispatchEvent(new Event(BRYTER_ENDRET));
  }

  return [paa, endre] as const;
}

export function ObjekttypeDetaljer({ id }: { id: number }) {
  const [visNvdbBeskrivelse, setVisNvdbBeskrivelse] = useLagretBryter(VIS_BESKRIVELSE_NOKKEL);
  const [visNvdbKrav, setVisNvdbKrav] = useLagretBryter(VIS_KRAV_NOKKEL);
  const [visAlleEgenskaper, setVisAlleEgenskaper] = useLagretBryter(VIS_ALLE_NOKKEL);
  const type = useVegobjekttype(id);
  const krav = useKrav(id);
  const lagre = useLagreKrav(id);
  const { iElektroKategori } = useElektro();
  const { data: sesjon } = authClient.useSession();
  const kanRedigere = !!sesjon && krav.isSuccess;

  if (type.isPending) return <DetaljerSkjelett />;

  if (type.isError) {
    if (erNvdbUtilgjengelig(type.error)) {
      return (
        <div className="mx-auto w-full max-w-6xl">
          <NvdbNede onProvIgjen={() => type.refetch()} />
        </div>
      );
    }
    return (
      <Alert variant="destructive">
        <AlertTitle>Kunne ikke hente vegobjekttypen</AlertTitle>
        <AlertDescription>{type.error.message}</AlertDescription>
      </Alert>
    );
  }

  const t = type.data;
  const markertElektro = krav.data?.elektro === true;
  const elektroViaKategori = iElektroKategori((t.kategorier ?? []).map((k) => k.id));
  const elektro = markertElektro || elektroViaKategori;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 md:gap-4">
      {krav.isError && (
        <Alert variant="destructive">
          <AlertTitle>Kunne ikke hente vegavdelingens krav</AlertTitle>
          <AlertDescription>Kravene fra NVDB vises likevel.</AlertDescription>
        </Alert>
      )}

      {lagre.isError && (
        <Alert variant="destructive">
          <AlertTitle>Endringen ble ikke lagret</AlertTitle>
          <AlertDescription>{lagre.error.message}</AlertDescription>
        </Alert>
      )}

      {kanRedigere && (
        <div className="flex justify-end">
          <AdminMeny
            markertElektro={markertElektro}
            elektroViaKategori={elektroViaKategori}
            onEndreElektro={(elektro) => lagre.mutate({ type: "elektro", vegobjekttypeId: id, elektro })}
          />
        </div>
      )}

      <ObjekttypeHode
        type={t}
        fkb={krav.data?.fkb ?? false}
        fkbKommentar={krav.data?.fkbKommentar ?? null}
        kanRedigere={kanRedigere}
        onFkb={(fkb) => lagre.mutate({ type: "fkb", vegobjekttypeId: id, fkb })}
        onFkbKommentar={async (kommentar) => {
          await lagre.mutateAsync({ type: "fkbKommentar", vegobjekttypeId: id, kommentar });
        }}
        elektro={elektro}
        tilleggsinformasjon={krav.data?.tilleggsinformasjon ?? null}
        onTilleggsinformasjon={async (tekst) => {
          await lagre.mutateAsync({ type: "tilleggsinformasjon", vegobjekttypeId: id, tekst });
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Egenskapstyper</CardTitle>
          <CardAction>
            <span className="flex flex-col items-start gap-2">
              <Field orientation="horizontal" title="Vis eller skjul NVDB sine kravmerker ved hver egenskap">
                <Switch
                  id="vis-nvdb-krav"
                  checked={visNvdbKrav}
                  onCheckedChange={(checked) => setVisNvdbKrav(checked)}
                />
                <FieldLabel htmlFor="vis-nvdb-krav" className="font-normal whitespace-nowrap">
                  Vis NVDB krav
                </FieldLabel>
              </Field>
              <Field orientation="horizontal" title="Vis eller skjul NVDB sin beskrivelse under hver egenskap">
                <Switch
                  id="vis-nvdb-beskrivelse"
                  checked={visNvdbBeskrivelse}
                  onCheckedChange={(checked) => setVisNvdbBeskrivelse(checked)}
                />
                <FieldLabel htmlFor="vis-nvdb-beskrivelse" className="font-normal whitespace-nowrap">
                  Vis NVDB beskrivelse
                </FieldLabel>
              </Field>
              {!kanRedigere && (
                <Field
                  orientation="horizontal"
                  title="Vis alle egenskaper, også de som ikke er påkrevd eller krysset av"
                >
                  <Switch
                    id="vis-alle-egenskaper"
                    checked={visAlleEgenskaper}
                    onCheckedChange={(checked) => setVisAlleEgenskaper(checked)}
                  />
                  <FieldLabel htmlFor="vis-alle-egenskaper" className="font-normal whitespace-nowrap">
                    Vis alle egenskaper
                  </FieldLabel>
                </Field>
              )}
            </span>
          </CardAction>
          <CardDescription>
            {visNvdbKrav && "Fargede merkene viser kravet i NVDB. "}
            &apos;Krav til innlevering&apos; er hva geodata syns bør være med.
            {kanRedigere && (
              <span className="block">Du er innlogget som admin og kan endre krav og kommentarer.</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EgenskapTabell
            egenskaper={t.egenskapstyper}
            krav={krav.data?.egenskaper}
            kanRedigere={kanRedigere}
            visNvdbBeskrivelse={visNvdbBeskrivelse}
            visNvdbKrav={visNvdbKrav}
            visAlleEgenskaper={visAlleEgenskaper}
            onKreves={(egenskapstypeId, kreves) =>
              lagre.mutate({ type: "kreves", vegobjekttypeId: id, egenskapstypeId, kreves })
            }
            onBeskrivelse={async (egenskapstypeId, beskrivelse) => {
              await lagre.mutateAsync({
                type: "beskrivelse",
                vegobjekttypeId: id,
                egenskapstypeId,
                beskrivelse,
              });
            }}
          />
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 md:gap-6 xl:grid-cols-2">
        <RelasjonKort
          tittel="Morobjekter"
          relasjoner={t.relasjonstyper.foreldre}
          tomTekst="Ingen morobjekter."
        />
        <RelasjonKort
          tittel="Datterobjekter"
          relasjoner={t.relasjonstyper.barn}
          tomTekst="Ingen datterobjekter."
        />
      </div>
    </div>
  );
}
