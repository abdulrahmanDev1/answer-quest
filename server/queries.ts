import "server-only";
import { db } from "@/server/db";
import { answers, users } from "./db/schema";

export async function getQuestions() {
  return await db.query.questions.findMany();
}

export async function getLatestQuestionBy() {
  return await db.query.questions.findFirst({
    orderBy: (model, { desc }) => desc(model.createdAt),
  });
}

export async function createUser(email: string, name: string) {
  const existingUser = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.email, email),
  });

  if (existingUser) {
    return { error: "User already exists", user: existingUser };
  }

  const result = await db.insert(users).values({ email, name });

  return result;
}

export async function getUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.email, email),
  });

  if (!user) {
    return "User not found";
  }

  return user;
}

export async function createAnswer(
  questionId: number,
  userId: number,
  answer: string,
) {
  const result = await db.insert(answers).values({
    content: answer,
    answeredBy: userId.toString(),
    questionId: questionId.toString(),
  });

  return result;
}
