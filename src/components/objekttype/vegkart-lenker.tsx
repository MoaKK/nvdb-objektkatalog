import Image from "next/image";
import { Button } from "@/components/ui/button";
import { vegkartHeleNorge, vegkartMoreOgRomsdal } from "@/lib/nvdb/vegkart";

function Lenke({ href, omrade, title }: { href: string; omrade: string; title: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="justify-start whitespace-nowrap"
      nativeButton={false}
      render={<a href={href} target="_blank" rel="noopener noreferrer" title={title} />}
    >
      <Image src="/vegvesen-merke.png" alt="" width={16} height={16} />
      <span className="hidden sm:inline">Vis i vegkart -&nbsp;</span>
      {omrade}
    </Button>
  );
}

export function VegkartLenker({ id, navn }: { id: number; navn: string }) {
  return (
    <span className="flex flex-col items-stretch gap-2">
      <Lenke
        href={vegkartHeleNorge(id)}
        omrade="Hele Norge"
        title={`Vis ${navn} i hele Norge i NVDB vegkart (åpnes i ny fane)`}
      />
      <Lenke
        href={vegkartMoreOgRomsdal(id)}
        omrade="Møre og Romsdal"
        title={`Vis ${navn} i Møre og Romsdal i NVDB vegkart (åpnes i ny fane)`}
      />
    </span>
  );
}
