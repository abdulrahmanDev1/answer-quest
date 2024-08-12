"use client";
import { HoverCard } from "@/components/hover-card";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
interface Question {
  id: number;
  question: string;
  answer: string;
  answeredBy: string;
  answeredAt: string;
}

function Loader({ width }: { width?: number }) {
  return (
    <LoaderCircle
      width={width}
      height={width}
      className="mx-auto animate-spin duration-[10000] "
    />
  );
}
export default function Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionLoading, setQuestionLoading] = useState(true);
  useEffect(() => {
    const fetchQuestion = async () => {
      setQuestionLoading(true);
      const geQuestions = await axios.get("/api/questions");
      setQuestions(geQuestions.data);
      setQuestionLoading(false);
    };
    fetchQuestion();
  }, []);
  return (
    <main className="flex gap-4 flex-col items-center justify-between p-24">
      <h1 className="text-6xl">Question & Answers</h1>
      <h4 className="text-lg text-gray-400">
        Hover on the question to see the answer
      </h4>

      {questionLoading ? (
        <Loader width={50} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {questions.map((question) => (
            <div key={question.id}>
              <HoverCard
                question={question.question}
                answer={question.answer}
                answeredBy={question.answeredBy}
                answeredAt={new Date(question.answeredAt).toLocaleString()}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
