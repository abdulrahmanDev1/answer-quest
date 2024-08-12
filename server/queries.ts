import "server-only";
import { db } from "@/server/db";
import { answers, logs, questions, users } from "./db/schema";

export async function getQuestions() {
  return await db.query.questions.findMany();
}

export async function getQuestionsWithAnswers() {
  // Fetch all questions
  const questions = await db.query.questions.findMany();

  // Extract all question IDs
  const questionIds = questions.map((question) => question.id);

  // Fetch all answers for the given question IDs
  const answers = await db.query.answers.findMany({
    where: (model, { eq, or }) =>
      or(...questionIds.map((id) => eq(model.questionId, id))),
  });

  // Extract all user IDs from the answers
  const userIds = [...new Set(answers.map((answer) => answer.answeredBy))];

  // Fetch all users with the extracted user IDs
  const users = await db.query.users.findMany({
    where: (model, { eq, or }) => or(...userIds.map((id) => eq(model.id, id))),
  });

  // Create a map for quick user lookup
  const userMap = new Map(users.map((user) => [user.id, user]));

  // Map the questions to include the answer and user data
  const questionsWithAnswers = questions.map((question) => {
    const answer = answers.find((answer) => answer.questionId === question.id);
    const user = answer ? userMap.get(answer.answeredBy) : null;

    if (!answer || !user) return null;

    return {
      question: question.content,
      answer: answer.content,
      answeredBy: user.name,
      answeredAt: answer.createdAt,
    };
  });

  // Filter out any null values
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
