CREATE TABLE "saved_blast_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"label" text NOT NULL,
	"engine" text DEFAULT 'ncbi' NOT NULL,
	"rid" text NOT NULL,
	"program" text NOT NULL,
	"database" text NOT NULL,
	"entrez_query" text DEFAULT '' NOT NULL,
	"evalue" text NOT NULL,
	"hitlist_size" integer NOT NULL,
	"query_sequence" text NOT NULL,
	"result_json" jsonb NOT NULL,
	"num_hits" integer DEFAULT 0 NOT NULL,
	"best_hit_title" text,
	"best_evalue" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "saved_blast_jobs_label_len" CHECK (char_length("saved_blast_jobs"."label") between 1 and 120)
);
--> statement-breakpoint
ALTER TABLE "saved_blast_jobs" ADD CONSTRAINT "saved_blast_jobs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "saved_blast_jobs_user_rid_uq" ON "saved_blast_jobs" USING btree ("user_id","rid");--> statement-breakpoint
CREATE INDEX "saved_blast_jobs_user_created_idx" ON "saved_blast_jobs" USING btree ("user_id","created_at");