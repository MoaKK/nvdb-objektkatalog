import { NextResponse } from "next/server";
import { z } from "zod";
import { hentVegobjekttypeMedRelasjoner } from "@/lib/nvdb/client";
import { feilrespons } from "@/lib/nvdb/feil";

const idSchema = z.string().regex(/^\d{1,7}$/).transform(Number);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const parsed = idSchema.safeParse((await params).id);
  if (!parsed.success) {
    return NextResponse.json({ feil: "Ugyldig id" }, { status: 400 });
  }
  try {
    const type = await hentVegobjekttypeMedRelasjoner(parsed.data);
    return NextResponse.json(type, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    return feilrespons(error);
  }
}
