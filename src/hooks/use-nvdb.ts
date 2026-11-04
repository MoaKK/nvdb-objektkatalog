"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiFeil } from "@/lib/nvdb/api-feil";
import type {
  VegobjekttypeDetaljer,
  VegobjekttypeIndeks,
  Vegobjekttypekategori,
} from "@/lib/nvdb/schemas";

async function hentJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { feil?: string; kode?: string } | null;
    throw new ApiFeil(body?.feil ?? `Feil ${res.status}`, res.status, body?.kode ?? null);
  }
  return res.json() as Promise<T>;
}

export const queryKeys = {
  sokeindeks: ["vegobjekttyper"] as const,
  vegobjekttype: (id: number) => ["vegobjekttyper", id] as const,
  kategorier: ["kategorier"] as const,
};

export function useSokeindeks() {
  return useQuery({
    queryKey: queryKeys.sokeindeks,
    queryFn: () => hentJson<VegobjekttypeIndeks[]>("/api/nvdb/vegobjekttyper"),
    staleTime: 1000 * 60 * 60,
  });
}

export function useKategorier() {
  return useQuery({
    queryKey: queryKeys.kategorier,
    queryFn: () => hentJson<Vegobjekttypekategori[]>("/api/nvdb/kategorier"),
    staleTime: 1000 * 60 * 60,
  });
}

export function useVegobjekttype(id: number) {
  return useQuery({
    queryKey: queryKeys.vegobjekttype(id),
    queryFn: () => hentJson<VegobjekttypeDetaljer>(`/api/nvdb/vegobjekttyper/${id}`),
    enabled: Number.isInteger(id) && id > 0,
  });
}