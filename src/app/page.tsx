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
          Finn objektet i menyen til venstre for å se hvilke egenskaper som skal være med ved
          innlevering, og hvordan det henger sammen med mor- og datterobjekter.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}