import { NextResponse } from "next/server";
import { hentSokeindeks } from "@/lib/nvdb/client";
import { feilrespons } from "@/lib/nvdb/feil";

export async function GET() {
  try {
    const typer = await hentSokeindeks();
    return NextResponse.json(typer, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    return feilrespons(error);
  }
}