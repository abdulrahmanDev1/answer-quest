import { type NextRequest, NextResponse } from "next/server";
import {
  createAnswer,
  createQuestion,
  getLatestQuestion,
  getUser,
} from "@/server/queries";
import { revalidatePath } from "next/cache";
import { env } from "@/env";

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
    return NextResponse.json({
      error: "User not found",
    });
  }

  const latestQuestion = await getLatestQuestion();
  console.log("Latest Question", latestQuestion);
  console.log("User Result", user);
  const createdAnswer = await createAnswer(latestQuestion!.id, user.id, answer);

  console.log("Created Answer", createdAnswer);
  const createdQuestion = await createQuestion(
    createdAnswer!.answeredBy,
    question,
  );
  console.log("Created Question", createdQuestion);
  revalidatePath("/");
  return NextResponse.redirect(env.NEXT_PUBLIC_HOSTNAME + "/ty");
}
