import { getQuestionsWithAnswers } from "@/server/queries";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const questions = await getQuestionsWithAnswers();
  return NextResponse.json(questions);
}
