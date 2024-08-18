"use client";
import { motion } from "framer-motion";
import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { HoverCard } from "@/components/hover-card";
import { LoaderCircle } from "lucide-react";

const queryClient = new QueryClient();

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
      className="mx-auto animate-spin duration-[10s]"
    />
  );
}

async function fetchQuestions(): Promise<Question[]> {
  const response = await fetch("/api/questions");

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  return response.json();
}

function QuestionsContent() {
  const {
    data: questions,
    isLoading,
    error,
  } = useQuery<Question[], Error>({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
    staleTime: 1000 * 60 * 5, // cache data for 5 minutes
  });

  if (isLoading) {
    return <Loader width={50} />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="py-4 lg:py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {questions?.map((question, index) => (
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

export default function Questions() {
  return (
    <QueryClientProvider client={queryClient}>
      <QuestionsContent />
    </QueryClientProvider>
  );
}
