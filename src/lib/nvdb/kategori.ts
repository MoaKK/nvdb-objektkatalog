export type Datakategori = "1" | "2" | "3" | "annet";

export const DATAKATEGORIER: { id: Datakategori; navn: string }[] = [
  { id: "1", navn: "Kategori 1 - Nasjonale data" },
  { id: "2", navn: "Kategori 2 - Nasjonale data" },
  { id: "3", navn: "Kategori 3 - Vegholders egne data" },
  { id: "annet", navn: "Annet" },
];

export function tilDatakategori(hovedkategori?: string | null): Datakategori {
  switch (hovedkategori) {
    case "Kategori 21":
      return "1";
    case "Kategori 22":
      return "2";
    case "Kategori 23":
      return "3";
    default:
      return "annet";
  }
}