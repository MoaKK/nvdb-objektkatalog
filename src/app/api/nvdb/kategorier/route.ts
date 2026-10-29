import { NextResponse } from "next/server";
import { hentKategorier } from "@/lib/nvdb/client";
import { feilrespons } from "@/lib/nvdb/feil";

export async function GET() {
  try {
    const kategorier = await hentKategorier();
    return NextResponse.json(kategorier, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    return feilrespons(error);
  }
}