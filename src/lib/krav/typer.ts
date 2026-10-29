// Delt mellom server og klient (ingen databasekode her)
export interface Egenskapskrav {
  kreves: boolean;
  beskrivelse: string | null;
}

export interface Kravdata {
  fkb: boolean;
  // Nøkkel: egenskapstype-id som tekst
  egenskaper: Record<string, Egenskapskrav>;
}
