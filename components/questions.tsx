"use client";
import { motion } from "framer-motion";
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
      className="mx-auto animate-spin duration-[10s] "
    />
  );
}

export const fetchCache = "force-no-store";

function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionLoading, setQuestionLoading] = useState(true);
  useEffect(() => {
    const fetchQuestion = async () => {
      setQuestionLoading(true);
      const response = await fetch("/api/questions", {
        cache: "no-store",
        next: {
          revalidate: 0,
        },
      });
      const data = await response.json();
      setQuestions(data);
      setQuestionLoading(false);
    };
    fetchQuestion();
  }, []);
  return questionLoading ? (
    <Loader width={50} />
  ) : (
    <div className=" py-4 lg:py-10  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {questions.map((question, index) => (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.2, ease: "easeOut" }}
        >
          <HoverCard
            question={question.question}
            answer={question.answer}
            answeredBy={question.answeredBy}
            answeredAt={new Date(question.answeredAt).toLocaleString()}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default Questions;
