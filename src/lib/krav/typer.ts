export interface Egenskapskrav {
  kreves: boolean;
  beskrivelse: string | null;
}

export interface Kravdata {
  fkb: boolean;
  fkbKommentar: string | null;
  tilleggsinformasjon: string | null;
  elektro: boolean;
  egenskaper: Record<string, Egenskapskrav>;
}

export interface Kravoversikt {
  medKrav: number[];
  elektro: number[];
}
