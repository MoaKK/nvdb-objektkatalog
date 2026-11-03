export interface Egenskapskrav {
  kreves: boolean;
  beskrivelse: string | null;
}

export interface Kravdata {
  fkb: boolean;
  fkbKommentar: string | null;
  tilleggsinformasjon: string | null;
  egenskaper: Record<string, Egenskapskrav>;
}
