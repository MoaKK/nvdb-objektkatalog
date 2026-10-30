import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  DetaljerSkjelett,
  ObjekttypeDetaljer,
} from "@/components/objekttype/objekttype-detaljer";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ObjekttypePage({ params }: Props) {
  return (
    <Suspense fallback={<DetaljerSkjelett />}>
      <Innhold params={params} />
    </Suspense>
  );
}

async function Innhold({ params }: Props) {
  const { id } = await params;
  if (!/^\d{1,7}$/.test(id)) notFound();
  return <ObjekttypeDetaljer id={Number(id)} />;
}
