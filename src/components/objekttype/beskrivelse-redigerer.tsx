"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BESKRIVELSE_MAKS } from "@/lib/krav/endring";

interface Props {
  verdi: string | null;
  navn: string;
  kanRedigere: boolean;
  onLagre: (tekst: string) => Promise<void>;
}

export function BeskrivelseRedigerer({ verdi, navn, kanRedigere, onLagre }: Props) {
  const [redigerer, setRedigerer] = useState(false);
  const [tekst, setTekst] = useState("");
  const [lagrer, setLagrer] = useState(false);
  const [feil, setFeil] = useState<string | null>(null);

  if (!redigerer) {
    return (
      <span className="flex flex-col items-start gap-1">
        {verdi && <span className="whitespace-pre-line">{verdi}</span>}
        {kanRedigere && (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground"
            onClick={() => {
              setTekst(verdi ?? "");
              setFeil(null);
              setRedigerer(true);
            }}
          >
            <Pencil />
            {verdi ? "Rediger" : "Legg til beskrivelse"}
          </Button>
        )}
      </span>
    );
  }

  const forLang = tekst.length > BESKRIVELSE_MAKS;
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
        maxLength={BESKRIVELSE_MAKS}
        aria-label={`Beskrivelse for ${navn}`}
        aria-invalid={forLang || undefined}
        disabled={lagrer}
        autoFocus
      />
      <span className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={lagre} disabled={lagrer || forLang || uendret}>
          {lagrer ? "Lagrer..." : "Lagre"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setRedigerer(false)} disabled={lagrer}>
          Avbryt
        </Button>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {tekst.length}/{BESKRIVELSE_MAKS}
        </span>
      </span>
      {feil && <span className="text-sm text-destructive">{feil}</span>}
    </span>
  );
}
