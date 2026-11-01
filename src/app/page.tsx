import { Signpost } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function Home() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Signpost />
        </EmptyMedia>
        <EmptyTitle>Velg en vegobjekttype</EmptyTitle>
        <EmptyDescription>
          Her finner du vegobjekttyper fra NVDB sin datakatalog. For hvert objekt har geodata
          krysset av for egenskapene vi ønsker at innmålere fyller ut og tar med når de leverer
          data. Velg et objekt i menyen for å se kravene.
        </EmptyDescription>
        <EmptyDescription>
          Hele datakatalogen finner du hos{" "}
          <a
            href="https://datakatalogen.atlas.vegvesen.no/"
            target="_blank"
            rel="noopener noreferrer"
            title="Åpne NVDB sin datakatalog i en ny fane"
          >
            Statens vegvesen
          </a>
          .
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
