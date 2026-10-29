import { sql } from "drizzle-orm";
import { boolean, check, integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
// Relativ import fordi drizzle-kit ikke kjenner "@/"-aliaset
import { user } from "./auth-schema";

// Vegavdelingens krav per egenskapstype på en vegobjekttype (tabellen på objektsiden)
export const egenskapskrav = pgTable(
  "egenskapskrav",
  {
    vegobjekttypeId: integer("vegobjekttype_id").notNull(),
    egenskapstypeId: integer("egenskapstype_id").notNull(),
    kreves: boolean("kreves").notNull().default(false),
    beskrivelse: text("beskrivelse"),
    oppdatert: timestamp("oppdatert", { withTimezone: true }).notNull().defaultNow(),
    // Hvem som sist endret raden. Beholdes som tom hvis brukeren slettes.
    oppdatertAv: text("oppdatert_av").references(() => user.id, { onDelete: "set null" }),
  },
  (t) => [
    primaryKey({ columns: [t.vegobjekttypeId, t.egenskapstypeId] }),
    // Databasen håndhever også maksimal lengde, ikke bare koden
    check("egenskapskrav_beskrivelse_lengde", sql`char_length(${t.beskrivelse}) <= 1000`),
  ],
);

// Vegavdelingens krav for hele vegobjekttypen
export const objekttypekrav = pgTable("objekttypekrav", {
  vegobjekttypeId: integer("vegobjekttype_id").primaryKey(),
  fkb: boolean("fkb").notNull().default(false),
  oppdatert: timestamp("oppdatert", { withTimezone: true }).notNull().defaultNow(),
  oppdatertAv: text("oppdatert_av").references(() => user.id, { onDelete: "set null" }),
});
