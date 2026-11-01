"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { anvendEndring, type Kravendring } from "@/lib/krav/endring";
import { lagreKravendring } from "@/lib/krav/lagre";
import type { Kravdata } from "@/lib/krav/typer";

export const kravKey = (vegobjekttypeId: number) => ["krav", vegobjekttypeId] as const;
export const kravoversiktKey = ["kravoversikt"] as const;

export function useTyperMedKrav(enabled = true) {
  return useQuery({
    queryKey: kravoversiktKey,
    queryFn: async () => {
      const res = await fetch("/api/krav", { headers: { Accept: "application/json" } });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { feil?: string } | null;
        throw new Error(body?.feil ?? `Feil ${res.status}`);
      }
      return res.json() as Promise<number[]>;
    },
    enabled,
    staleTime: 30_000,
  });
}

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

export function useLagreKrav(vegobjekttypeId: number) {
  const queryClient = useQueryClient();
  const key = kravKey(vegobjekttypeId);

  return useMutation({
    mutationFn: async (endring: Kravendring) => {
      const resultat = await lagreKravendring(endring);
      if (!resultat.ok) throw new Error(resultat.feil);
    },
    onMutate: async (endring) => {
      await queryClient.cancelQueries({ queryKey: key });
      const forrige = queryClient.getQueryData<Kravdata>(key);
      queryClient.setQueryData<Kravdata>(key, (data) => anvendEndring(data, endring));
      return { forrige };
    },
    onError: (_feil, _endring, kontekst) => {
      if (kontekst?.forrige) queryClient.setQueryData(key, kontekst.forrige);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: kravoversiktKey });
    },
  });
}
