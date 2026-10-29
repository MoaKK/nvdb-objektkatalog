import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function NotFound() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchX />
        </EmptyMedia>
        <EmptyTitle>Fant ikke siden</EmptyTitle>
        <EmptyDescription>
          Siden eller vegobjekttypen finnes ikke. Velg en vegobjekttype i menyen til venstre.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" render={<Link href="/" />} nativeButton={false}>
          Til forsiden
        </Button>
      </EmptyContent>
    </Empty>
  );
}