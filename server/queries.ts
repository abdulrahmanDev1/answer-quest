import "server-only";
import { db } from "@/server/db";
import { sql } from "drizzle-orm";
import { answers, logs, questions, users } from "./db/schema";

export async function getQuestions() {
  return await db.query.questions.findMany();
}

export async function getQuestionById(id: string) {
  return await db.query.questions.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });
}

export async function getQuestionsWithAnswers() {
  try {
    const questionsWithAnswers = await db.execute(sql`
      SELECT
        q.content AS question_content,
        a.content AS answer_content,
        a."created_at" AS answer_created_at,
        u.name AS user_name
      FROM
        "answer-quest_questions" q
      JOIN
        "answer-quest_answers" a ON q.id = a."question_id"
      JOIN
        "answer-quest_users" u ON a."answered_by" = u.id
      ORDER BY
        a."created_at" DESC
    `);

    const results = questionsWithAnswers.map((row) => ({
      question: row.question_content,
      answer: row.answer_content,
      answeredBy: row.user_name,
      answeredAt: row.answer_created_at,
    }));
    return results;
  } catch (error) {
    console.error("Error fetching questions with answers:", error);
    throw error;
  }
}

export async function getLatestQuestion() {
  return await db.query.questions.findFirst({
    orderBy: (model, { desc }) => desc(model.createdAt),
  });
}

export async function createQuestion(askedBy: string, question: string) {
  let existingQuestion = await db.query.questions.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.askedBy, askedBy), eq(model.content, question)),
  });

  if (existingQuestion) {
    return existingQuestion;
  }

  await db.insert(questions).values({ askedBy: askedBy, content: question });
  existingQuestion = await db.query.questions.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.askedBy, askedBy), eq(model.content, question)),
  });

  return existingQuestion;
}

export async function getUser(email: string, name: string) {
  let user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.email, email),
  });

  if (!user) {
    await db.insert(users).values({ email, name });
    user = await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.email, email),
    });
  }

  return user;
}

export async function getUserById(userId: string) {
  return await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.id, userId),
  });
}

export async function createAnswer(
  questionId: string,
  userId: string,
  answer: string,
) {
  const existingAnswer = await db.query.answers.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.answeredBy, userId), eq(model.questionId, questionId)),
  });

  if (existingAnswer) {
    return existingAnswer;
  }

  await db.insert(answers).values({
    content: answer,
    answeredBy: userId,
    questionId: questionId,
  });

  const createdAnswer = await db.query.answers.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.answeredBy, userId), eq(model.questionId, questionId)),
  });

  return createdAnswer;
}

export async function getAnswers(questionId: string) {
  return await db.query.answers.findMany({
    where: (model, { eq }) => eq(model.questionId, questionId),
  });
}

export async function getAnswer(answerId: string) {
  return await db.query.answers.findFirst({
    where: (model, { eq }) => eq(model.id, answerId),
  });
}

export async function getUserAnswer(userId: string, questionId: string) {
  const answer = await db.query.answers.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.answeredBy, userId), eq(model.questionId, questionId)),
  });

  if (!answer) {
    return null;
  }
  return answer;
}

export async function getQuestion(questionId: string) {
  return await db.query.questions.findFirst({
    where: (model, { eq }) => eq(model.id, questionId),
  });
}

export async function getQuestionAnswers(questionId: string) {
  return await db.query.answers.findMany({
    where: (model, { eq }) => eq(model.questionId, questionId),
  });
}

export async function createLog(log: {
  userId: string;
  answeredQuestionId: string;
  createdAnswerId: string;
  createdQuestionId: string;
  creatorResponse: string;
}) {
  const {
    userId,
    answeredQuestionId,
    createdAnswerId,
    createdQuestionId,
    creatorResponse,
  } = log;

  const result = await db.insert(logs).values({
    userId: userId,
    answeredQuestionId: answeredQuestionId,
    createdAnswerId: createdAnswerId,
    createdQuestionId: createdQuestionId,
    creatorResponse: creatorResponse,
  });

  return result[0];
}
