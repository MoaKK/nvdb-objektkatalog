export const NVDB_STATUS_URL = "https://nvdbstatus.atlas.vegvesen.no/";

export class ApiFeil extends Error {
  status: number;
  kode: string | null;

  constructor(melding: string, status: number, kode: string | null = null) {
    super(melding);
    this.status = status;
    this.kode = kode;
  }
}

export function erNvdbUtilgjengelig(feil: unknown) {
  if (feil instanceof ApiFeil) {
    return feil.kode === "NVDB_UTILGJENGELIG" || feil.status >= 500;
  }
  return feil instanceof TypeError;
}
