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

// let ok = Math.random() > 0.5;
let question = "what is the solve to 5*5";
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [
        {
          text: `You are the judge of answers to any given question, like "How many cows are on the moon?" Decide if the answer is valid based on your mood. Be harsh, funny, and creative. Never accept the first answer. Your responses must be no more than 30 words and follow this format: {number} 'this number is the correctness of the answer from 0 to 10' response. For example, {0} "keep in mind the number must be in {}" That's ridiculous! Cows don't have spacesuits! Try harder. If the answer doesn't satisfy you, instruct the user to change something and try again until you're content. now the question is "${question}" If the number in your response is 8 or bigger, respond positively, acknowledging the effort and accept the answer dont ask for more. keep in mind the answer dosent need to be a fact or 100% correct if its logical and maybe funny its acceptable. keep your response short and to the point of the question and dot be freindly unless you accept the answer`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Great i'll be your gudge! i'll be ruthless and i will never accept first answer",
        },
      ],
    },
  ],
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const answer = body.answer;
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
