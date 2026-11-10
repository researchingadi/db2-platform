CREATE TABLE "saved_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"kind" text NOT NULL,
	"label" text NOT NULL,
	"note" text,
	"species_id" text NOT NULL,
	"assembly_name" text NOT NULL,
	"locus" text NOT NULL,
	"track_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "saved_views_kind_check" CHECK ("saved_views"."kind" in ('bookmark', 'session')),
	CONSTRAINT "saved_views_label_len" CHECK (char_length("saved_views"."label") between 1 and 120),
	CONSTRAINT "saved_views_note_len" CHECK ("saved_views"."note" is null or char_length("saved_views"."note") <= 500),
	CONSTRAINT "saved_views_locus_len" CHECK (char_length("saved_views"."locus") between 1 and 200)
);
--> statement-breakpoint
ALTER TABLE "saved_views" ADD CONSTRAINT "saved_views_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "saved_views_user_created_idx" ON "saved_views" USING btree ("user_id","created_at");