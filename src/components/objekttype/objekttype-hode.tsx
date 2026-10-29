import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatakategoriBadge } from "@/components/datakategori-badge";
import type { VegobjekttypeDetaljer } from "@/lib/nvdb/schemas";

export function ObjekttypeHode({ type }: { type: VegobjekttypeDetaljer }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xl md:text-2xl">
          {type.navn}
          <span className="font-mono text-lg text-muted-foreground md:text-xl">{type.id}</span>
        </CardTitle>
        {type.beskrivelse && (
          <CardDescription className="text-sm md:text-base">{type.beskrivelse}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <span className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium">Hovedkategori:</span>
          <DatakategoriBadge hovedkategori={type.hovedkategori} />
          {type.må_ha_mor && <Badge variant="outline">Må ha morobjekt</Badge>}
        </span>
        {type.veiledning && <p className="text-sm text-muted-foreground">{type.veiledning}</p>}
      </CardContent>
    </Card>
  );
}
