// localhost:3000/api/submit?answer=25&question=whatisthesolvto5*5&email=test@email.com
import { type NextRequest, NextResponse } from "next/server";
import {
  createAnswer,
  createUser,
  getQuestions,
  getUserByEmail,
} from "@/server/queries";

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
  const questions = getQuestions();
  const user = await createUser("test@t.co", "D7OM");
  // const user = await getUserByEmail("test@t.co");
  console.log("createdUser", user);
  const { question, answer, email } = decodeUrlParams(url);
  const createdAnswer = await createAnswer(, 1, "25");

  return NextResponse.json({ question, answer, email, questions, user });
}
