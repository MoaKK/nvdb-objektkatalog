import "server-only";
import { cacheLife } from "next/cache";
import { z } from "zod";
import { env } from "@/lib/env";
import {
  vegobjekttypeDetailSchema,
  vegobjekttypeSummarySchema,
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
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new NvdbError(res.status, `NVDB svarte ${res.status}`);
  return res.json();
}

export async function hentVegobjekttyper() {
  "use cache";
  cacheLife("days");

  const data = await nvdbFetch("/vegobjekttyper");
  const liste = Array.isArray(data)
    ? data
    : (data as { objekter?: unknown })?.objekter;
  return z.array(vegobjekttypeSummarySchema).parse(liste);
}

export async function hentVegobjekttype(id: number) {
  "use cache";
  cacheLife("days");

  const data = await nvdbFetch(`/vegobjekttyper/${id}`);
  return vegobjekttypeDetailSchema.parse(data);
}