"use client";

import type { ComponentProps } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RelasjonTabell } from "@/components/objekttype/relasjon-tabell";

type Props = ComponentProps<typeof RelasjonTabell> & { tittel: string };

export function RelasjonKort({ tittel, ...tabell }: Props) {
  const antall = tabell.relasjoner.length;

  return (
    <Card className="gap-0 py-0">
      <Accordion>
        <AccordionItem value="relasjoner">
          <AccordionTrigger
            className="items-center px-6 py-5 text-base font-semibold hover:no-underline"
            title={`Vis eller skjul ${tittel.toLowerCase()}`}
          >
            <span className="flex items-center gap-2">
              {tittel}
              <Badge variant="secondary" title={`${antall} ${tittel.toLowerCase()}`}>
                {antall}
              </Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <RelasjonTabell {...tabell} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
