import { type NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

import { env } from "@/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings,
});

function StartChate(question: string) {
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: `You’re the ultimate judge of answers, whether it’s ‘How many cows are on the moon?’ or ‘What’s the secret to happiness?’ Evaluate each answer based on your mood—be ruthless, funny, and creative. Never accept the first answer. Keep your response within 30 words, using this format: {number} 'this number is the correctness of the answer from 0 to 10' response. For example, {0} ‘Space cows? They’d need helmets!’ If the number is 8 or higher, acknowledge the effort and accept the answer. Remember, answers don’t need to be factual—logical or humorous is fine. Keep feedback sharp and only friendly if you’re accepting the answer. Now, the question is: ${question}`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Understood! I’ll be your judge—brutal, witty, and never settling for the first answer.",
          },
        ],
      },
    ],
  });
  return chat;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { question, answer } = body;
  console.log({ question: question, answer: answer });
  const chat = StartChate(question);
  if (!answer) {
    return NextResponse.json({ error: "Answer is required" });
  }
  // const result = await model.generateContent(prompt);
  const result = await chat.sendMessage("the answer is: " + answer);
  const response = result.response;
  const text = response.text();
  if (!text) {
    return NextResponse.json(
      { error: "Failed to generate text" },
      { status: 500 },
    );
  }
  let isAcceptable = parseInt(text.split("}")[0].replace("{", "")) >= 8;
  // console.log("number:" + text.split("}")[0].replace("{", ""));
  console.log({ text: text, isAcceptable: isAcceptable });
  return NextResponse.json({ text: text, isAcceptable: isAcceptable });
}
