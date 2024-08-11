CREATE TABLE IF NOT EXISTS "hackathon_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"answered_by" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hackathon_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asked_by" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hackathon_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "hackathon_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "myproject_answers";--> statement-breakpoint
DROP TABLE "myproject_questions";--> statement-breakpoint
DROP TABLE "myproject_users";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hackathon_answers" ADD CONSTRAINT "hackathon_answers_answered_by_hackathon_users_id_fk" FOREIGN KEY ("answered_by") REFERENCES "public"."hackathon_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hackathon_answers" ADD CONSTRAINT "hackathon_answers_question_id_hackathon_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."hackathon_questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hackathon_questions" ADD CONSTRAINT "hackathon_questions_asked_by_hackathon_users_id_fk" FOREIGN KEY ("asked_by") REFERENCES "public"."hackathon_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "answered_by_idx" ON "hackathon_answers" USING btree ("answered_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "question_id_idx" ON "hackathon_answers" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "asked_by_idx" ON "hackathon_questions" USING btree ("asked_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "hackathon_users" USING btree ("email");