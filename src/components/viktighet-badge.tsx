"use client";

import { Info } from "lucide-react";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { VIKTIGHET_TEKST } from "@/lib/nvdb/schemas";
import { cn } from "@/lib/utils";

const VARIANT = {
  PÅKREVD_ABSOLUTT: "absolutt",
  PÅKREVD_IKKE_ABSOLUTT: "pakrevd",
  BETINGET: "betinget",
  OPSJONELL: "opsjonell",
  MINDRE_VIKTIG: "mindre",
} as const;

interface Props {
  viktighet: string;
  // Veiledning fra NVDB, f.eks. "Påkrevd der ny fartsgrense avviker fra ..."
  forklaring?: string | null;
}

// Viser NVDB sin viktighet med farge; "ikke satt" og historisk vises ikke.
// Finnes det en forklaring, åpnes den ved hover på PC og ved trykk på mobil/nettbrett.
export function ViktighetBadge({ viktighet, forklaring }: Props) {
  const variant = VARIANT[viktighet as keyof typeof VARIANT];
  if (!variant) return null;
  const tekst = VIKTIGHET_TEKST[viktighet];

  if (!forklaring) {
    return (
      <Badge variant={variant} title={`Krav i NVDB: ${tekst}`}>
        {tekst}
      </Badge>
    );
  }

  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        delay={100}
        className={cn(badgeVariants({ variant }), "cursor-help")}
        aria-label={`${tekst}. Vis forklaring`}
      >
        {tekst}
        <Info data-icon="inline-end" />
      </PopoverTrigger>
      <PopoverContent className="w-72 text-sm">{forklaring}</PopoverContent>
    </Popover>
  );
}
