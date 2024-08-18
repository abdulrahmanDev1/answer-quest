CREATE TABLE IF NOT EXISTS "answer-quest_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"answered_by" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "answer-quest_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"answered_question_id" uuid NOT NULL,
	"created_answer_id" uuid NOT NULL,
	"created_question_id" uuid NOT NULL,
	"creator_response" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "answer-quest_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asked_by" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "answer-quest_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "answer-quest_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer-quest_answers" ADD CONSTRAINT "answer-quest_answers_answered_by_answer-quest_users_id_fk" FOREIGN KEY ("answered_by") REFERENCES "public"."answer-quest_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer-quest_answers" ADD CONSTRAINT "answer-quest_answers_question_id_answer-quest_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."answer-quest_questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer-quest_logs" ADD CONSTRAINT "answer-quest_logs_user_id_answer-quest_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."answer-quest_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer-quest_logs" ADD CONSTRAINT "answer-quest_logs_answered_question_id_answer-quest_questions_id_fk" FOREIGN KEY ("answered_question_id") REFERENCES "public"."answer-quest_questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer-quest_logs" ADD CONSTRAINT "answer-quest_logs_created_answer_id_answer-quest_answers_id_fk" FOREIGN KEY ("created_answer_id") REFERENCES "public"."answer-quest_answers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer-quest_logs" ADD CONSTRAINT "answer-quest_logs_created_question_id_answer-quest_questions_id_fk" FOREIGN KEY ("created_question_id") REFERENCES "public"."answer-quest_questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer-quest_questions" ADD CONSTRAINT "answer-quest_questions_asked_by_answer-quest_users_id_fk" FOREIGN KEY ("asked_by") REFERENCES "public"."answer-quest_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "answered_by_idx" ON "answer-quest_answers" USING btree ("answered_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "question_id_idx" ON "answer-quest_answers" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "answer-quest_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "answered_question_id_idx" ON "answer-quest_logs" USING btree ("answered_question_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_answer_id_idx" ON "answer-quest_logs" USING btree ("created_answer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_question_id_idx" ON "answer-quest_logs" USING btree ("created_question_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "asked_by_idx" ON "answer-quest_questions" USING btree ("asked_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "answer-quest_users" USING btree ("email");