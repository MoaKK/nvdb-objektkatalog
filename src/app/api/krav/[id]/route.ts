import { NextResponse } from "next/server";
import { z } from "zod";
import { hentKrav } from "@/lib/krav/hent";

// Kun rene sifre godtas
const idSchema = z.string().regex(/^\d{1,7}$/).transform(Number);

// Bare lesing her. Endringer kommer senere og krever innlogget admin.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) {
    return NextResponse.json({ feil: "Ugyldig id" }, { status: 400 });
  }
  try {
    const krav = await hentKrav(parsed.data);
    // Ikke cache: endringer fra admin skal synes med en gang
    return NextResponse.json(krav, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    // Detaljer logges på serveren, klienten får en generell melding
    console.error(error);
    return NextResponse.json({ feil: "Kunne ikke hente krav" }, { status: 500 });
  }
}
