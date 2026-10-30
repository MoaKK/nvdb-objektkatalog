import "server-only";
import { cacheLife } from "next/cache";
import { z } from "zod";
import { env } from "@/lib/env";
import {
  type Relasjon,
  vegobjekttypeDetailSchema,
  vegobjekttypeIndeksSchema,
  vegobjekttypekategoriSchema,
} from "@/lib/nvdb/schemas";

const DATAKATALOG = "/datakatalog/api/v1";

export class NvdbError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function nvdbFetch(path: string): Promise<unknown> {
  const url = new URL(`${DATAKATALOG}${path}`, env.NVDB_API_BASE);
  const res = await fetch(url, {
    headers: { Accept: "application/json", "X-Client": env.NVDB_X_CLIENT },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new NvdbError(res.status, `NVDB svarte ${res.status}`);
  return res.json();
}

export async function hentSokeindeks() {
  "use cache: remote";
  cacheLife("days");

  const data = await nvdbFetch("/vegobjekttyper");
  return z.array(vegobjekttypeIndeksSchema).parse(data);
}

export async function hentVegobjekttype(id: number) {
  "use cache: remote";
  cacheLife("days");

  const data = await nvdbFetch(`/vegobjekttyper/${id}`);
  return vegobjekttypeDetailSchema.parse(data);
}

export async function hentKategorier() {
  "use cache: remote";
  cacheLife("days");

  const data = await nvdbFetch("/kategorier");
  return z
    .array(vegobjekttypekategoriSchema)
    .parse(data)
    .sort((a, b) => (a.sorteringsnummer ?? 0) - (b.sorteringsnummer ?? 0));
}

export async function hentVegobjekttypeMedRelasjoner(id: number) {
  const [type, indeks] = await Promise.all([hentVegobjekttype(id), hentSokeindeks()]);
  const kjente = new Set(indeks.map((t) => t.id));
  const merk = (r: Relasjon) => ({ ...r, finnes: kjente.has(r.innhold.type.id) });

  return {
    ...type,
    relasjonstyper: {
      foreldre: type.relasjonstyper.foreldre.map(merk),
      barn: type.relasjonstyper.barn.map(merk),
    },
  };
}