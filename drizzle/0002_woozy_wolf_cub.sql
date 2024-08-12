CREATE TABLE IF NOT EXISTS "hackathon_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"answered_question_id" uuid NOT NULL,
	"created_answer_id" uuid NOT NULL,
	"created_question_id" uuid NOT NULL,
	"creator_response" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hackathon_logs" ADD CONSTRAINT "hackathon_logs_user_id_hackathon_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."hackathon_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hackathon_logs" ADD CONSTRAINT "hackathon_logs_answered_question_id_hackathon_questions_id_fk" FOREIGN KEY ("answered_question_id") REFERENCES "public"."hackathon_questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hackathon_logs" ADD CONSTRAINT "hackathon_logs_created_answer_id_hackathon_answers_id_fk" FOREIGN KEY ("created_answer_id") REFERENCES "public"."hackathon_answers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hackathon_logs" ADD CONSTRAINT "hackathon_logs_created_question_id_hackathon_questions_id_fk" FOREIGN KEY ("created_question_id") REFERENCES "public"."hackathon_questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "hackathon_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "answered_question_id_idx" ON "hackathon_logs" USING btree ("answered_question_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_answer_id_idx" ON "hackathon_logs" USING btree ("created_answer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_question_id_idx" ON "hackathon_logs" USING btree ("created_question_id");