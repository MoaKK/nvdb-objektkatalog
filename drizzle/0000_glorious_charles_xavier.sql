CREATE TABLE "egenskapskrav" (
	"vegobjekttype_id" integer NOT NULL,
	"egenskapstype_id" integer NOT NULL,
	"kreves" boolean DEFAULT false NOT NULL,
	"beskrivelse" text,
	"oppdatert" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "egenskapskrav_vegobjekttype_id_egenskapstype_id_pk" PRIMARY KEY("vegobjekttype_id","egenskapstype_id"),
	CONSTRAINT "egenskapskrav_beskrivelse_lengde" CHECK (char_length("egenskapskrav"."beskrivelse") <= 1000)
);
--> statement-breakpoint
CREATE TABLE "objekttypekrav" (
	"vegobjekttype_id" integer PRIMARY KEY NOT NULL,
	"fkb" boolean DEFAULT false NOT NULL,
	"oppdatert" timestamp with time zone DEFAULT now() NOT NULL
);
