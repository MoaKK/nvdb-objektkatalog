import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { NvdbError } from "@/lib/nvdb/client";

export function feilrespons(error: unknown) {
  console.error(error);
  if (error instanceof NvdbError && error.status === 404) {
    return NextResponse.json({ feil: "Fant ikke objekttypen" }, { status: 404 });
  }
  if (error instanceof ZodError) {
    return NextResponse.json({ feil: "Uventet svar fra NVDB" }, { status: 502 });
  }
  return NextResponse.json({ feil: "Kunne ikke hente data fra NVDB" }, { status: 502 });
}