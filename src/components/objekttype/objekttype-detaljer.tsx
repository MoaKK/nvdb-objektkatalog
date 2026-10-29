"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
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
import { EgenskapTabell } from "@/components/objekttype/egenskap-tabell";
import { ObjekttypeHode } from "@/components/objekttype/objekttype-hode";
import { RelasjonTabell } from "@/components/objekttype/relasjon-tabell";
import { useKrav, useLagreKrav } from "@/hooks/use-krav";
import { useVegobjekttype } from "@/hooks/use-nvdb";
import { authClient } from "@/lib/auth-client";

export function DetaljerSkjelett() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

// Huskes per nettleser. Bare en visningsinnstilling, ingen data.
const VIS_BESKRIVELSE_NOKKEL = "nvdb-vis-nvdb-beskrivelse";

function useVisNvdbBeskrivelse() {
  const [vis, setVis] = useState(false);

  // Leses etter første render, ellers blir HTML fra server og klient ulik
  useEffect(() => {
    try {
      setVis(localStorage.getItem(VIS_BESKRIVELSE_NOKKEL) === "1");
    } catch {
      /* lagring er valgfri */
    }
  }, []);

  function endre(ny: boolean) {
    setVis(ny);
    try {
      localStorage.setItem(VIS_BESKRIVELSE_NOKKEL, ny ? "1" : "0");
    } catch {
      /* lagring er valgfri */
    }
  }

  return [vis, endre] as const;
}

export function ObjekttypeDetaljer({ id }: { id: number }) {
  const [visNvdbBeskrivelse, setVisNvdbBeskrivelse] = useVisNvdbBeskrivelse();
  const type = useVegobjekttype(id);
  // Vegavdelingens egne krav fra databasen, hentes parallelt med NVDB-dataene
  const krav = useKrav(id);
  const lagre = useLagreKrav(id);
  // Bare admin-kontoer får sesjon, så en sesjon betyr admin. Serveren sjekker likevel ved lagring.
  const { data: sesjon } = authClient.useSession();
  const kanRedigere = !!sesjon && krav.isSuccess;

  if (type.isPending) return <DetaljerSkjelett />;

  if (type.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Kunne ikke hente vegobjekttypen</AlertTitle>
        <AlertDescription>{type.error.message}</AlertDescription>
      </Alert>
    );
  }

  const t = type.data;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
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

      <ObjekttypeHode
        type={t}
        fkb={krav.data?.fkb ?? false}
        kanRedigere={kanRedigere}
        onFkb={(fkb) => lagre.mutate({ type: "fkb", vegobjekttypeId: id, fkb })}
      />

      <Card>
        <CardHeader>
          <CardTitle>Egenskapstyper</CardTitle>
          <CardAction>
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
          </CardAction>
          <CardDescription>
            Fargede merkene viser kravet i NVDB. 'Krav til innlevering' er hva geodata syns bør være med.
            {kanRedigere && " Du er innlogget som admin og kan endre krav og kommentarer."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EgenskapTabell
            egenskaper={t.egenskapstyper}
            krav={krav.data?.egenskaper}
            kanRedigere={kanRedigere}
            visNvdbBeskrivelse={visNvdbBeskrivelse}
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

      <div className="grid gap-4 md:gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Morobjekter</CardTitle>
          </CardHeader>
          <CardContent>
            <RelasjonTabell relasjoner={t.relasjonstyper.foreldre} tomTekst="Ingen morobjekter." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Datterobjekter</CardTitle>
          </CardHeader>
          <CardContent>
            <RelasjonTabell relasjoner={t.relasjonstyper.barn} tomTekst="Ingen datterobjekter." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
