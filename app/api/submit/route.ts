import { type NextRequest, NextResponse } from "next/server";
import {
  createAnswer,
  createLog,
  createQuestion,
  getLatestQuestion,
  getUser,
  getUserById,
} from "@/server/queries";
import { revalidatePath } from "next/cache";
import { env } from "@/env";
import { sendAnswerEmail } from "@/lib/send-answer-email";

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
  const { question, answer, email, name } = decodeUrlParams(url);
  const user = await getUser(email, name);
  if (!user) {
    return NextResponse.json({ error: "User not found" });
  }

  const latestQuestion = await getLatestQuestion();
  const askedQuestionUser = await getUserById(latestQuestion!.askedBy);

  const createdAnswer = await createAnswer(latestQuestion!.id, user.id, answer);

  const createdQuestion = await createQuestion(
    createdAnswer!.answeredBy,
    question,
  );

  const creatorResponse = {
    question: latestQuestion?.content,
    answer: createdAnswer?.content,
    answeredBy: name,
    email: user.email,
  };
  sendAnswerEmail({
    email: askedQuestionUser!.email,
    AnswerEmailProps: {
      name: askedQuestionUser!.name,
      askedQuestion: latestQuestion!.content,
      answer: createdAnswer!.content,
      answeredBy: user!.name,
      answerCreatedAt: createdAnswer!.createdAt.toLocaleString(),
      checkUrl: `${env.NEXT_PUBLIC_HOSTNAME}/questions`,
    },
  });
  const log = {
    userId: user.id,
    answeredQuestionId: latestQuestion!.id,
    createdAnswerId: createdAnswer!.id,
    createdQuestionId: createdQuestion!.id,
    creatorResponse: JSON.stringify(creatorResponse),
  };

  const createdLog = await createLog(log);

  console.log("createdLog:", createdLog);

  revalidatePath("/");
  return NextResponse.redirect(env.NEXT_PUBLIC_HOSTNAME + "/ty");
}
