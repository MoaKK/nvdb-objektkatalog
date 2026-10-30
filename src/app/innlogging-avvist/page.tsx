import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function InnloggingAvvist() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShieldX />
        </EmptyMedia>
        <EmptyTitle>Ingen admin-tilgang</EmptyTitle>
        <EmptyDescription>
          Kontoen du logget inn med står ikke på listen over administratorer. Du kan fortsatt se
          alle krav uten å logge inn.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          variant="outline"
          render={<Link href="/" />}
          nativeButton={false}
          title="Gå til forsiden"
        >
          Til forsiden
        </Button>
      </EmptyContent>
    </Empty>
  );
}
