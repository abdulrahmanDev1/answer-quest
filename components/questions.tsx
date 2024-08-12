"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { HoverCard } from "@/components/hover-card";
import { LoaderCircle } from "lucide-react";

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

function Questions() {
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
  return questionLoading ? (
    <Loader width={50} />
  ) : (
    <div className=" py-4 lg:py-10  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
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
  );
}

export default Questions;
