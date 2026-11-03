"use client";

import { useCallback, useMemo } from "react";
import { useKravoversikt } from "@/hooks/use-krav";
import { useKategorier } from "@/hooks/use-nvdb";
import { erElektroKategori } from "@/lib/nvdb/elektro";

export function useElektro() {
  const kategorier = useKategorier();
  const oversikt = useKravoversikt();

  const elektroKategorier = useMemo(
    () =>
      new Set((kategorier.data ?? []).filter((k) => erElektroKategori(k.navn)).map((k) => k.id)),
    [kategorier.data],
  );
  const markert = useMemo(() => new Set(oversikt.data?.elektro ?? []), [oversikt.data]);

  const iElektroKategori = useCallback(
    (typekategorier: number[]) => typekategorier.some((k) => elektroKategorier.has(k)),
    [elektroKategorier],
  );

  const erElektro = useCallback(
    (id: number, typekategorier: number[]) => markert.has(id) || iElektroKategori(typekategorier),
    [markert, iElektroKategori],
  );

  return { erElektro, iElektroKategori };
}
