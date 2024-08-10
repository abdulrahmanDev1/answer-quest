import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY is not defined in the environment variables");
}
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    // stopSequences: ["x"],
    // maxOutputTokens: 1000,
  },
});

// let ok = Math.random() > 0.5;
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [
        {
          text: `You are the gudge to a contest with the question how many cows are on the moon? you deside wether the answer is a valid or not based on your mode make it hard and be rough accept based on your mode dont accept any answer if you dont feel like accepting the answer tell the user to change somthing you dont like about it and try again until the answer satesfies you. your responce must be at most 20 words. in you response you MUST give me a precintage of your desigion and make it in a double qoutes for example "6" Yout Answer is Correct and the 6 here is out of 10 with your desigin like "10" thats good answer!'`,
        },
      ],
    },
    {
      role: "model",
      parts: [{ text: "Great i'll be your gudge!" }],
    },
  ],
});

export async function POST(req: NextRequest) {
  // console.log("req", req);
  const body = await req.json();
  const answer = body.answer;
  // console.log("answer", answer);
  if (!answer) {
    return NextResponse.json({ error: "Answer is required" });
  }
  // const result = await model.generateContent(prompt);
  const result = await chat.sendMessage(answer);
  const response = result.response;
  const text = response.text();
  if (!text) {
    return NextResponse.json(
      { error: "Failed to generate text" },
      { status: 500 },
    );
  }
  let isAcceptable = parseInt(text.split('"')[1]) >= 8;
  console.log({ text: text, isAcceptable: isAcceptable });
  return NextResponse.json({ text: text, isAcceptable: isAcceptable });
}
