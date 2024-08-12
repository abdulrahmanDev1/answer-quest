import "server-only";
import { db } from "@/server/db";
import { answers, questions, users } from "./db/schema";

export async function getQuestions() {
  return await db.query.questions.findMany();
}

export async function getQuestionsWithAnswers() {
  const questions = await db.query.questions.findMany();

  const questionsWithAnswers = await Promise.all(
    questions.map(async (question) => {
      const answer = await db.query.answers.findFirst({
        where: (model, { eq }) => eq(model.questionId, question.id),
      });
      if (!answer) return null;

      const user = await db.query.users.findFirst({
        where: (model, { eq }) => eq(model.id, answer.answeredBy),
      });
      if (!user) return null;

      return {
        question: question.content,
        answer: answer.content,
        answeredBy: user.name,
        answeredAt: answer.createdAt,
      };
    }),
  );

  const filteredQuestions = questionsWithAnswers.filter(Boolean);

  return filteredQuestions;
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
