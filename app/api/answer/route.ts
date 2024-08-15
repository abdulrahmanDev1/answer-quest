import { chat } from "@/lib/model";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { question, answer } = body;
  if (!answer) {
    return NextResponse.json({ error: "Answer is required" });
  }
  const response = await chat(
    `The question is : ${question.content} and the answer is : ${answer}`,
  );

  const text = response.text();
  if (!text) {
    return NextResponse.json(
      {
        error: "Failed to generate text",
        text: "Change your answer and try again.",
      },
      { status: 500 },
    );
  }
  const regex = /\{(\d+)\}/g;
  const match = regex.exec(text);
  const percentage = match ? parseInt(match[1]) : 0;
  let isAcceptable = percentage >= 85;

  console.log({
    Question: question.content,
    Answer: answer,
    Response: text,
    Percentage: percentage,
    IsAcceptable: isAcceptable,
  });

  return NextResponse.json({
    text,
    isAcceptable,
    percentage,
  });
}
