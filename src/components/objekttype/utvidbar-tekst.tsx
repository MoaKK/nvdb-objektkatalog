"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  tekst: string;
  className?: string;
  klippKlasse?: string;
  hva?: string;
}

export function UtvidbarTekst({
  tekst,
  className,
  klippKlasse = "line-clamp-3",
  hva = "teksten",
}: Props) {
  const [utvidet, setUtvidet] = useState(false);
  const [forLang, setForLang] = useState(false);
  const tekstRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = tekstRef.current;
    if (!element || utvidet) return;
    const sjekk = () => setForLang(element.scrollHeight > element.clientHeight + 1);
    sjekk();
    const observer = new ResizeObserver(sjekk);
    observer.observe(element);
    return () => observer.disconnect();
  }, [tekst, utvidet]);

  return (
    <span className="flex flex-col items-start gap-1">
      <span
        ref={tekstRef}
        className={cn("block whitespace-pre-line wrap-anywhere", !utvidet && klippKlasse, className)}
      >
        {tekst}
      </span>
      {(forLang || utvidet) && (
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0"
          aria-expanded={utvidet}
          title={utvidet ? `Vis mindre av ${hva}` : `Vis hele ${hva}`}
          onClick={() => setUtvidet(!utvidet)}
        >
          {utvidet ? "Vis mindre" : "Les mer"}
        </Button>
      )}
    </span>
  );
}
