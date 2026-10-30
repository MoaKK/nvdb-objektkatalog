import { sql } from "drizzle-orm";
import { boolean, check, integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const egenskapskrav = pgTable(
  "egenskapskrav",
  {
    vegobjekttypeId: integer("vegobjekttype_id").notNull(),
    egenskapstypeId: integer("egenskapstype_id").notNull(),
    kreves: boolean("kreves").notNull().default(false),
    beskrivelse: text("beskrivelse"),
    oppdatert: timestamp("oppdatert", { withTimezone: true }).notNull().defaultNow(),
    oppdatertAv: text("oppdatert_av").references(() => user.id, { onDelete: "set null" }),
  },
  (t) => [
    primaryKey({ columns: [t.vegobjekttypeId, t.egenskapstypeId] }),
    check("egenskapskrav_beskrivelse_lengde", sql`char_length(${t.beskrivelse}) <= 1000`),
  ],
);

export const objekttypekrav = pgTable("objekttypekrav", {
  vegobjekttypeId: integer("vegobjekttype_id").primaryKey(),
  fkb: boolean("fkb").notNull().default(false),
  oppdatert: timestamp("oppdatert", { withTimezone: true }).notNull().defaultNow(),
  oppdatertAv: text("oppdatert_av").references(() => user.id, { onDelete: "set null" }),
});
