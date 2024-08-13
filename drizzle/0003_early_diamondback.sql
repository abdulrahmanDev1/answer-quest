ALTER TABLE "answer-quest_answers" RENAME TO "answer-quest_answers";--> statement-breakpoint
ALTER TABLE "answer-quest_logs" RENAME TO "answer-quest_logs";--> statement-breakpoint
ALTER TABLE "answer-quest_questions" RENAME TO "answer-quest_questions";--> statement-breakpoint
ALTER TABLE "answer-quest_users" RENAME TO "answer-quest_users";--> statement-breakpoint
ALTER TABLE "answer-quest_users" DROP CONSTRAINT "answer-quest_users_email_unique";--> statement-breakpoint
ALTER TABLE "answer-quest_answers" DROP CONSTRAINT "answer-quest_answers_answered_by_answer-quest_users_id_fk";
--> statement-breakpoint
ALTER TABLE "answer-quest_answers" DROP CONSTRAINT "answer-quest_answers_question_id_answer-quest_questions_id_fk";
--> statement-breakpoint
ALTER TABLE "answer-quest_logs" DROP CONSTRAINT "answer-quest_logs_user_id_answer-quest_users_id_fk";
--> statement-breakpoint
ALTER TABLE "answer-quest_logs" DROP CONSTRAINT "answer-quest_logs_answered_question_id_answer-quest_questions_id_fk";
--> statement-breakpoint
ALTER TABLE "answer-quest_logs" DROP CONSTRAINT "answer-quest_logs_created_answer_id_answer-quest_answers_id_fk";
--> statement-breakpoint
ALTER TABLE "answer-quest_logs" DROP CONSTRAINT "answer-quest_logs_created_question_id_answer-quest_questions_id_fk";
--> statement-breakpoint
ALTER TABLE "answer-quest_questions" DROP CONSTRAINT "answer-quest_questions_asked_by_answer-quest_users_id_fk";
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
ALTER TABLE "answer-quest_users" ADD CONSTRAINT "answer-quest_users_email_unique" UNIQUE("email");
