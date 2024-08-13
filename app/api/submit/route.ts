import { type NextRequest, NextResponse } from "next/server";
import {
  checkIsAnswered,
  createAnswer,
  createLog,
  createQuestion,
  getQuestionById,
  getUser,
  getUserById,
} from "@/server/queries";
import { revalidatePath } from "next/cache";
import { env } from "@/env";
import { sendAnswerEmail } from "@/lib/send-answer-email";

// Function to decode URL parameters
function decodeUrlParams(url: string): Record<string, string> {
  const urlObj = new URL(url);
  const params: Record<string, string> = {};

  urlObj.searchParams.forEach((value, key) => {
    params[key] = decodeURIComponent(value);
  });

  return params;
}

export async function GET(req: NextRequest) {
  const url = req.url;
  // Decode URL parameters
  const { question, answer, answeredQuestion, email, name } =
    decodeUrlParams(url);

  // Get user by email and name
  const user = await getUser(email, name);
  if (!user) {
    return NextResponse.redirect(
      env.NEXT_PUBLIC_HOSTNAME + "/error?error=User not found",
    );
  }

  // Get the question by its ID
  const questionAnswered = await getQuestionById(answeredQuestion);
  if (!questionAnswered) {
    return NextResponse.redirect(
      env.NEXT_PUBLIC_HOSTNAME + "/error?error=Question not found",
    );
  }

  // Check if the question has already been answered
  const isAnswered = await checkIsAnswered(questionAnswered.id);
  if (isAnswered) {
    return NextResponse.redirect(
      env.NEXT_PUBLIC_HOSTNAME + "/error?error=Question already answered",
    );
  }

  // Prevent a user from answering their own question
  if (questionAnswered?.askedBy === user.id) {
    return NextResponse.redirect(
      env.NEXT_PUBLIC_HOSTNAME +
        "/error?error=User cannot answer their own question",
    );
  }

  // Get the user who asked the question
  const askedQuestionUser = await getUserById(questionAnswered.askedBy);

  // Create an answer and a new question
  const createdAnswer = await createAnswer(
    questionAnswered.id,
    user.id,
    answer,
  );
  const createdQuestion = await createQuestion(user.id, question);

  // Prepare the response for the creator
  const creatorResponse = {
    question: questionAnswered.content,
    answer: createdAnswer?.content,
    answeredBy: name,
    email: user.email,
  };

  // Prepare the log
  const log = {
    userId: user.id,
    answeredQuestionId: questionAnswered!.id,
    createdAnswerId: createdAnswer!.id,
    createdQuestionId: createdQuestion!.id,
    creatorResponse: JSON.stringify(creatorResponse),
  };

  // Create the log
  const createdLog = await createLog(log);

  console.log("createdLog:", createdLog);

  // Revalidate the path
  revalidatePath("/");
  revalidatePath("/questions");

  // Send the answer email
  sendAnswerEmail({
    email: askedQuestionUser!.email,
    AnswerEmailProps: {
      name: askedQuestionUser!.name,
      askedQuestion: questionAnswered.content,
      answer: createdAnswer!.content,
      answeredBy: user!.name,
      answerCreatedAt: createdAnswer!.createdAt.toLocaleString(),
      checkUrl: `${env.NEXT_PUBLIC_HOSTNAME}/questions`,
    },
  });

  // Redirect to the thank you page
  return NextResponse.redirect(env.NEXT_PUBLIC_HOSTNAME + "/ty");
}
