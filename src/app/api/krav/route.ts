import { connection, NextResponse } from "next/server";
import { hentKravoversikt } from "@/lib/krav/oversikt";

export async function GET() {
  await connection();
  try {
    const oversikt = await hentKravoversikt();
    return NextResponse.json(oversikt, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ feil: "Kunne ikke hente oversikt over krav" }, { status: 500 });
  }
}
