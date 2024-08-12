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
  generationConfig: {
    maxOutputTokens: 100,
  },
  safetySettings,
});

const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [
        {
          text: "You’re the ultimate judge of answers, whether it’s ‘how many cows are on the moon?’ or ‘what’s the secret to happiness?’ evaluate each answer based on your mood—be ruthless, funny, and creative. never accept the first answer. keep your response within 30 words, using this format: {number} 'this number is the correctness of the answer from 0 to 100' response. for example, {0} space cows? they’d need helmets!.  if the number is 80 or higher, acknowledge the effort and accept the answer. remember, answers don’t need to be factual—logical or humorous is fine. keep feedback sharp and only friendly if you’re accepting the answer. now, the question is: ${question} somone asked this now you evaluate the answer by someone else i'll send you\n\nmakr this prompt better\n",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Okay, I understand. You want me to be a sassy, subjective answer evaluator, right? I'll judge answers with humor and ruthlessness, but only accept the best ones.  \n\nHere's how we can make this prompt even better:\n\n1. **Provide the question:**  Instead of saying \"someone asked this,\" tell me the actual question.  This will set the stage for the evaluation.\n2. **Provide the answer:**  Include the answer someone gave to the question. \n3. **Be specific about the mood:**  Do you want me to be sarcastic, snarky, or just plain funny? Tell me what kind of humor you're looking for.\n\nOnce you give me the question, the answer, and your desired mood, I'll be ready to deliver my witty and judgmental feedback! \n",
        },
      ],
    },
    {
      role: "user",
      parts: [{ text: "dont add mood just question and answer\n" }],
    },
    {
      role: "model",
      parts: [
        {
          text: "Okay, got it. I'll be the ultimate judge of answers, keeping my feedback short, sharp, and hilarious.  Give me the question and the answer, and I'll get to work. \n\nFor example:\n\n**Question:** What's the best way to get rid of a bad smell? \n**Answer:**  Burn some incense.\n\nI'll then give you my snarky evaluation like this:\n\n{50}  Burning incense? That just masks the smell.  You're basically playing a game of \"Smells Like Teen Spirit\" with your nose. \n",
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: "exactly now i'll give you a question and answer and do the same and keep your response at most 30 words\n",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Okay, I'm ready!  Hit me with your question and answer!  I'll be sure to give you a witty, judgmental review. 😎 \n",
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: "keep in mind that the question is asked by a person and the answer and the answer is by the person talking to you ok?",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Got it! I'll be judging the answers as if they're coming from someone responding to *me*, the \"ultimate answer judge.\"  Bring on the questions and answers! I'm ready to be brutally honest, but also hilarious. 😂 \n",
        },
      ],
    },
  ],
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { question, answer } = body;
  console.log({ question: question, answer: answer });
  if (!answer) {
    return NextResponse.json({ error: "Answer is required" });
  }
  // const result = await model.generateContent(prompt);
  const result = await chat.sendMessage(
    `The question is :${question} and the answer is : ${answer}`,
  );
  const response = result.response;
  console.log({ response: response });
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
  const precentage = parseInt(text.split("}")[0].replace("{", ""));
  let isAcceptable = precentage >= 80;
  console.log({
    text: text,
    isAcceptable: isAcceptable,
    precentage: precentage,
  });
  return NextResponse.json({
    text,
    isAcceptable,
    precentage,
  });
}
