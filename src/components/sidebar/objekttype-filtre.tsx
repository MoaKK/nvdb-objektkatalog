"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKategorier } from "@/hooks/use-nvdb";
import type { Sokevalg } from "@/lib/nvdb/sok";

const ALLE_KATEGORIER_ID = 38;

interface Props {
  valg: Sokevalg;
  onChange: (valg: Sokevalg) => void;
}

export function ObjekttypeFiltre({ valg, onChange }: Props) {
  const kategorier = useKategorier();

  const kategoriListe = (kategorier.data ?? []).filter((k) => k.id !== ALLE_KATEGORIER_ID);

  const kategoriNavn: Record<string, string> = {
    alle: "Alle kategorier",
    ...Object.fromEntries(kategoriListe.map((k) => [String(k.id), k.navn])),
  };

  function sett<K extends keyof Sokevalg>(key: K, value: Sokevalg[K]) {
    onChange({ ...valg, [key]: value });
  }

  return (
    <FieldGroup className="gap-2">
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          value={valg.tekst}
          onChange={(e) => sett("tekst", e.target.value)}
          placeholder="Søk på navn eller id"
          maxLength={100}
          aria-label="Søk etter vegobjekttyper"
          title="Søk på navn eller nummer"
        />
        {valg.tekst && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              onClick={() => sett("tekst", "")}
              aria-label="Tøm søk"
              title="Tøm søk"
            >
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      <Collapsible>
        <CollapsibleTrigger
          title="Vis eller skjul filtre"
          render={<Button variant="ghost" size="sm" className="group w-full justify-between" />}
        >
          Filtre
          <ChevronDown className="transition-transform group-data-[panel-open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <FieldGroup className="gap-4 pt-2">
            <FieldSet className="gap-2">
              <FieldLegend variant="label">Søk også i</FieldLegend>
              <Field orientation="horizontal" title="Søk også i navnene på egenskapstypene">
                <Checkbox
                  id="sok-egenskaper"
                  checked={valg.iEgenskaper}
                  onCheckedChange={(c) => sett("iEgenskaper", c === true)}
                />
                <FieldLabel htmlFor="sok-egenskaper" className="font-normal">
                  Egenskapstyper
                </FieldLabel>
              </Field>
              <Field orientation="horizontal" title="Søk også i tillatte verdier, f.eks. materialtyper">
                <Checkbox
                  id="sok-verdier"
                  checked={valg.iVerdier}
                  onCheckedChange={(c) => sett("iVerdier", c === true)}
                />
                <FieldLabel htmlFor="sok-verdier" className="font-normal">
                  Tillatte verdier
                </FieldLabel>
              </Field>
            </FieldSet>

            <Field>
              <FieldLabel htmlFor="vegobjekttypekategori">Vegobjekttypekategori</FieldLabel>
              <Select
                items={kategoriNavn}
                value={valg.kategoriId === null ? "alle" : String(valg.kategoriId)}
                onValueChange={(v) =>
                  sett("kategoriId", v === null || v === "alle" ? null : Number(v))
                }
              >
                <SelectTrigger
                  id="vegobjekttypekategori"
                  size="sm"
                  className="w-full"
                  title="Vis bare vegobjekttyper i en bestemt kategori"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle kategorier</SelectItem>
                  {kategoriListe.map((k) => (
                    <SelectItem key={k.id} value={String(k.id)}>
                      {k.navn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <FieldSet className="gap-2">
              <FieldLegend variant="label">Sorter etter</FieldLegend>
              <RadioGroup
                value={valg.sortering}
                onValueChange={(v) => sett("sortering", v as Sokevalg["sortering"])}
                className="flex gap-4"
              >
                <Field orientation="horizontal" title="Sorter alfabetisk etter navn">
                  <RadioGroupItem value="navn" id="sorter-navn" />
                  <FieldLabel htmlFor="sorter-navn" className="font-normal">
                    Navn
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal" title="Sorter etter nummer i NVDB">
                  <RadioGroupItem value="nummer" id="sorter-nummer" />
                  <FieldLabel htmlFor="sorter-nummer" className="font-normal">
                    Nummer
                  </FieldLabel>
                </Field>
              </RadioGroup>
            </FieldSet>
          </FieldGroup>
        </CollapsibleContent>
      </Collapsible>
    </FieldGroup>
  );
}