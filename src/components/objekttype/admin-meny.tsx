"use client";

import { Pencil, Zap, ZapOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  markertElektro: boolean;
  elektroViaKategori: boolean;
  onEndreElektro: (elektro: boolean) => void;
}

export function AdminMeny({ markertElektro, elektroViaKategori, onEndreElektro }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            title="Admin: endre vegobjekttypen"
            aria-label="Admin: endre vegobjekttypen"
          />
        }
      >
        <Pencil />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto">
        {elektroViaKategori ? (
          <span
            className="block"
            title="Elektro-objekt gjennom vegobjekttypekategorien, kan ikke endres her"
          >
            <DropdownMenuItem disabled>
              <Zap />
              Marker som Elektro objekt
            </DropdownMenuItem>
          </span>
        ) : markertElektro ? (
          <DropdownMenuItem
            title="Fjern vegobjekttypen fra elektro-gruppen"
            onClick={() => onEndreElektro(false)}
          >
            <ZapOff />
            Fjern som Elektro objekt
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            title="Legg vegobjekttypen til i elektro-gruppen"
            onClick={() => onEndreElektro(true)}
          >
            <Zap />
            Marker som Elektro objekt
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
