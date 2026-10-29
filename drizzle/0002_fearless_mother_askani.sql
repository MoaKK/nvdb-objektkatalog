ALTER TABLE "egenskapskrav" ADD COLUMN "oppdatert_av" text;--> statement-breakpoint
ALTER TABLE "objekttypekrav" ADD COLUMN "oppdatert_av" text;--> statement-breakpoint
ALTER TABLE "egenskapskrav" ADD CONSTRAINT "egenskapskrav_oppdatert_av_user_id_fk" FOREIGN KEY ("oppdatert_av") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "objekttypekrav" ADD CONSTRAINT "objekttypekrav_oppdatert_av_user_id_fk" FOREIGN KEY ("oppdatert_av") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;