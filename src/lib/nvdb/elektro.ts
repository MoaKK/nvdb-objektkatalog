const ELEKTRO_KATEGORIER = [
  ["belysning", "elektro"],
  ["tunnelutstyr", "teknisk"],
];

export function erElektroKategori(navn: string) {
  const tekst = navn.toLowerCase();
  return ELEKTRO_KATEGORIER.some((ord) => ord.every((o) => tekst.includes(o)));
}

export const ELEKTRO_FARGE = "text-blue-600 dark:text-blue-400";
