import { getLatestQuestion } from "@/server/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const question = await getLatestQuestion();
  return NextResponse.json(question);
}
