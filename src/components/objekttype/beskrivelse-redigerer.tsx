"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BESKRIVELSE_MAKS } from "@/lib/krav/endring";
import { cn } from "@/lib/utils";

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

  const [utvidet, setUtvidet] = useState(false);
  const [forLangTilVisning, setForLangTilVisning] = useState(false);
  const tekstRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = tekstRef.current;
    if (!element || utvidet) return;
    const sjekk = () => setForLangTilVisning(element.scrollHeight > element.clientHeight + 1);
    sjekk();
    const observer = new ResizeObserver(sjekk);
    observer.observe(element);
    return () => observer.disconnect();
  }, [verdi, utvidet, redigerer]);

  if (!redigerer) {
    return (
      <span className="flex flex-col items-start gap-1">
        {verdi && (
          <span
            ref={tekstRef}
            className={cn("whitespace-pre-line wrap-anywhere", !utvidet && "line-clamp-3")}
          >
            {verdi}
          </span>
        )}
        {verdi && (forLangTilVisning || utvidet) && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0"
            aria-expanded={utvidet}
            title={utvidet ? "Vis mindre av kommentaren" : "Vis hele kommentaren"}
            onClick={() => setUtvidet(!utvidet)}
          >
            {utvidet ? "Vis mindre" : "Les mer"}
          </Button>
        )}
        {kanRedigere && (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground"
            title={verdi ? `Rediger kommentar for ${navn}` : `Legg til kommentar for ${navn}`}
            onClick={() => {
              setTekst(verdi ?? "");
              setFeil(null);
              setRedigerer(true);
            }}
          >
            <Pencil />
            {verdi ? "Rediger" : "Legg til kommentar"}
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
        aria-label={`Kommentar for ${navn}`}
        title={`Kommentar for ${navn}`}
        aria-invalid={forLang || undefined}
        disabled={lagrer}
        autoFocus
      />
      <span className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          title="Lagre kommentaren"
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
          title={`Maks ${BESKRIVELSE_MAKS} tegn`}
        >
          {tekst.length}/{BESKRIVELSE_MAKS}
        </span>
      </span>
      {feil && <span className="text-sm text-destructive">{feil}</span>}
    </span>
  );
}
