import { Badge } from "@/components/ui/badge";
import { DATAKATEGORIER, tilDatakategori } from "@/lib/nvdb/kategori";

export function DatakategoriBadge({ hovedkategori }: { hovedkategori?: string | null }) {
  const id = tilDatakategori(hovedkategori);
  const kategori = DATAKATEGORIER.find((k) => k.id === id);
  return <Badge
      variant={id === "annet" ? "outline" : "secondary"}
      title={`Hovedkategori i NVDB: ${kategori?.navn}`}
    >
      {kategori?.navn}
    </Badge>;
}
