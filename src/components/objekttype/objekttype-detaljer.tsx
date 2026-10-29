"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EgenskapTabell } from "@/components/objekttype/egenskap-tabell";
import { ObjekttypeHode } from "@/components/objekttype/objekttype-hode";
import { RelasjonTabell } from "@/components/objekttype/relasjon-tabell";
import { useKrav } from "@/hooks/use-krav";
import { useVegobjekttype } from "@/hooks/use-nvdb";

export function DetaljerSkjelett() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export function ObjekttypeDetaljer({ id }: { id: number }) {
  const type = useVegobjekttype(id);
  // Vegavdelingens egne krav fra databasen, hentes parallelt med NVDB-dataene
  const krav = useKrav(id);

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

      <ObjekttypeHode type={t} fkb={krav.data?.fkb ?? false} />

      <Card>
        <CardHeader>
          <CardTitle>Egenskapstyper</CardTitle>
          <CardDescription>
            Merkene viser kravet i NVDB. Krav til innlevering er vegavdelingens egne krav.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EgenskapTabell egenskaper={t.egenskapstyper} krav={krav.data?.egenskaper} />
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
