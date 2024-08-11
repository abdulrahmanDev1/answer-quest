import { sql } from "drizzle-orm";
import {
  uuid,
  text,
  timestamp,
  varchar,
  pgTableCreator,
  index,
} from "drizzle-orm/pg-core";

// Creating a table with a specific naming convention for a multi-project schema
export const createTable = pgTableCreator((name) => `hackathon_${name}`);

// Users table
export const users = createTable(
  "users",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
  },
  (table) => ({
    emailIndex: index("email_idx").on(table.email),
  }),
);

// Questions table
export const questions = createTable(
  "questions",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    askedBy: uuid("asked_by")
      .notNull()
      .references(() => users.id),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    askedByIndex: index("asked_by_idx").on(table.askedBy),
  }),
);

// Answers table
export const answers = createTable(
  "answers",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    content: text("content").notNull(),
    answeredBy: uuid("answered_by")
      .notNull()
      .references(() => users.id),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    answeredByIndex: index("answered_by_idx").on(table.answeredBy),
    questionIdIndex: index("question_id_idx").on(table.questionId),
  }),
);
