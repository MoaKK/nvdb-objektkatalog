import { connection, NextResponse } from "next/server";
import { hentTyperMedKrav } from "@/lib/krav/oversikt";

export async function GET() {
  await connection();
  try {
    const ider = await hentTyperMedKrav();
    return NextResponse.json(ider, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ feil: "Kunne ikke hente oversikt over krav" }, { status: 500 });
  }
}
