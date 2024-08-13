import { checkIsAnswered, getLatestQuestion } from "@/server/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const question = await getLatestQuestion();
  if (!question) {
    return NextResponse.json({ error: "No questions found" });
  }

  return NextResponse.json(question);
}
