"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UtvidbarTekst } from "@/components/objekttype/utvidbar-tekst";
import { BESKRIVELSE_MAKS } from "@/lib/krav/endring";

function stor(tekst: string) {
  return tekst.charAt(0).toUpperCase() + tekst.slice(1);
}

interface Props {
  verdi: string | null;
  navn: string;
  kanRedigere: boolean;
  onLagre: (tekst: string) => Promise<void>;
  etikett?: string;
  maks?: number;
}

export function BeskrivelseRedigerer({
  verdi,
  navn,
  kanRedigere,
  onLagre,
  etikett = "kommentar",
  maks = BESKRIVELSE_MAKS,
}: Props) {
  const [redigerer, setRedigerer] = useState(false);
  const [tekst, setTekst] = useState("");
  const [lagrer, setLagrer] = useState(false);
  const [feil, setFeil] = useState<string | null>(null);

  if (!redigerer) {
    return (
      <span className="flex flex-col items-start gap-1">
        {verdi && <UtvidbarTekst tekst={verdi} hva={`${etikett}en`} />}
        {kanRedigere && (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground"
            title={verdi ? `Rediger ${etikett} for ${navn}` : `Legg til ${etikett} for ${navn}`}
            onClick={() => {
              setTekst(verdi ?? "");
              setFeil(null);
              setRedigerer(true);
            }}
          >
            <Pencil />
            {verdi ? "Rediger" : `Legg til ${etikett}`}
          </Button>
        )}
      </span>
    );
  }

  const forLang = tekst.length > maks;
  const uendret = tekst.trim() === (verdi ?? "");

  async function lagre() {
    setLagrer(true);
    setFeil(null);
    try {
      await onLagre(tekst);
      setRedigerer(false);
    } catch (e) {
      setFeil(e instanceof Error ? e.message : "Kunne ikke lagre.");
    } finally {
      setLagrer(false);
    }
  }

  return (
    <span className="flex flex-col gap-2">
      <Textarea
        value={tekst}
        onChange={(e) => setTekst(e.target.value)}
        maxLength={maks}
        aria-label={`${stor(etikett)} for ${navn}`}
        title={`${stor(etikett)} for ${navn}`}
        aria-invalid={forLang || undefined}
        disabled={lagrer}
        autoFocus
      />
      <span className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          title={`Lagre ${etikett}en`}
          onClick={lagre}
          disabled={lagrer || forLang || uendret}
        >
          {lagrer ? "Lagrer..." : "Lagre"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          title="Avbryt uten å lagre"
          onClick={() => setRedigerer(false)}
          disabled={lagrer}
        >
          Avbryt
        </Button>
        <span
          className="ml-auto text-xs text-muted-foreground tabular-nums"
          title={`Maks ${maks} tegn`}
        >
          {tekst.length}/{maks}
        </span>
      </span>
      {feil && <span className="text-sm text-destructive">{feil}</span>}
    </span>
  );
}
