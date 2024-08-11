CREATE TABLE IF NOT EXISTS "myproject_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"answered_by" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "myproject_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asked_by" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "myproject_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "myproject_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "myproject_answers" ADD CONSTRAINT "myproject_answers_answered_by_myproject_users_id_fk" FOREIGN KEY ("answered_by") REFERENCES "public"."myproject_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "myproject_answers" ADD CONSTRAINT "myproject_answers_question_id_myproject_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."myproject_questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "myproject_questions" ADD CONSTRAINT "myproject_questions_asked_by_myproject_users_id_fk" FOREIGN KEY ("asked_by") REFERENCES "public"."myproject_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "answered_by_idx" ON "myproject_answers" USING btree ("answered_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "question_id_idx" ON "myproject_answers" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "asked_by_idx" ON "myproject_questions" USING btree ("asked_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "myproject_users" USING btree ("email");