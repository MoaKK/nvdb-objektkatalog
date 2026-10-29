"use client";

import { useQuery } from "@tanstack/react-query";
import type { Kravdata } from "@/lib/krav/typer";

export const kravKey = (vegobjekttypeId: number) => ["krav", vegobjekttypeId] as const;

export function useKrav(vegobjekttypeId: number) {
  return useQuery({
    queryKey: kravKey(vegobjekttypeId),
    queryFn: async () => {
      const res = await fetch(`/api/krav/${vegobjekttypeId}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { feil?: string } | null;
        throw new Error(body?.feil ?? `Feil ${res.status}`);
      }
      return res.json() as Promise<Kravdata>;
    },
    enabled: Number.isInteger(vegobjekttypeId) && vegobjekttypeId > 0,
    staleTime: 30_000,
  });
}
