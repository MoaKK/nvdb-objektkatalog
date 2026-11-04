"use client";

import { ExternalLink, RotateCw, ServerCrash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { NVDB_STATUS_URL } from "@/lib/nvdb/api-feil";

interface Props {
  onProvIgjen?: () => void;
  kompakt?: boolean;
}

function StatusLenke() {
  return (
    <Button
      variant="outline"
      size="sm"
      nativeButton={false}
      render={
        <a
          href={NVDB_STATUS_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Se driftsstatus for NVDB hos Statens vegvesen (åpnes i ny fane)"
        />
      }
    >
      <ExternalLink />
      NVDB driftsstatus
    </Button>
  );
}

function ProvIgjen({ onProvIgjen }: { onProvIgjen: () => void }) {
  return (
    <Button size="sm" title="Prøv å hente dataene på nytt" onClick={onProvIgjen}>
      <RotateCw />
      Prøv igjen
    </Button>
  );
}

export function NvdbNede({ onProvIgjen, kompakt = false }: Props) {
  if (kompakt) {
    return (
      <Alert variant="destructive">
        <ServerCrash />
        <AlertTitle>NVDB svarer ikke</AlertTitle>
        <AlertDescription>
          <span>
            NVDB sitt API Les ser ut til å være nede, så vegobjekttypene kan ikke hentes. Prøv
            igjen senere.
          </span>
          <span className="mt-2 flex flex-wrap gap-2">
            {onProvIgjen && <ProvIgjen onProvIgjen={onProvIgjen} />}
            <StatusLenke />
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ServerCrash />
        </EmptyMedia>
        <EmptyTitle>NVDB svarer ikke akkurat nå</EmptyTitle>
        <EmptyDescription>
          Denne siden henter vegobjekttypene fra NVDB sitt API Les. Det ser ut til at API-et er
          nede eller har problemer, så siden fungerer ikke som den skal. Prøv igjen om litt, eller
          sjekk driftsstatusen til NVDB.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row flex-wrap justify-center">
        {onProvIgjen && <ProvIgjen onProvIgjen={onProvIgjen} />}
        <StatusLenke />
      </EmptyContent>
    </Empty>
  );
}
