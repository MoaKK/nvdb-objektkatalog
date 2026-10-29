import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-2xl space-y-3">
      <h1 className="text-2xl font-semibold">Vegobjekttyper</h1>
      <p className="text-muted-foreground">
        Velg en vegobjekttype i menyen til venstre for å se hvilke egenskaper som skal være med
        ved innlevering, og hvordan objektet henger sammen med mor- og datterobjekter.
      </p>
    </div>
  );
}