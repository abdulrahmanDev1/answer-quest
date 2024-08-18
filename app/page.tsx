"use client";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { SubmitForm } from "@/components/SubmitForm";
import { Progress } from "@/components/ui/progress";
import HowTo from "@/components/how-to";
import { toast } from "sonner";
import AnswerFeedback from "@/components/AnswerFeedback";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from "@tanstack/react-query";

type Data = {
  text: string;
  isAcceptable: boolean;
  percentage: number;
  error?: string;
};
type Question = {
  id: string;
  askedBy: string;
  content: string;
  createdAt: string;
};

function Loader({ width }: { width?: number }) {
  return (
    <LoaderCircle
      width={width}
      height={width}
      className="mx-auto animate-spin duration-[10s] "
    />
  );
}

const queryClient = new QueryClient();

function PageContent() {
  const [answer, setAnswer] = useState("");
  const [acceptedAnswer, setAcceptedAnswer] = useState("");

  const { data: question, isPending: questionLoading } = useQuery<Question>({
    queryKey: ["question"],
    queryFn: async () => {
      const response = await fetch("/api/question", {
        cache: "no-store",
        next: { revalidate: 0 },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // cache data for 5 minutes
    refetchOnWindowFocus: false,
  });

  const submitAnswer = useMutation<
    Data,
    Error,
    { question: Question | null; answer: string }
  >({
    mutationFn: async ({ question, answer }) => {
      const response = await axios.post("/api/answer", { question, answer });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.isAcceptable) {
        setAcceptedAnswer(answer);
      }
    },
    onError: () => {
      toast.error("Failed to submit answer");
    },
  });

  const handleSubmit = () => {
    if (answer === "") {
      toast.error("Answer is required!");
      return;
    }
    submitAnswer.mutate({ question: question || null, answer });
  };

  return (
    <div className="mx-auto max-w-2xl py-4 md:py-16 lg:py-28 z-50  ">
      <div className="text-center flex justify-center items-center flex-col">
        <div className="relative min-h-full rounded-full px-3 mx-2 md:px-1 py-1 md:py-0.5 text-xs md:text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          Answer the question{" "}
          <span className="text-xs md:text-2xs text-gray-400">*if you can</span>{" "}
          and we&#39;ll answer your&#39;s
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-indigo-600 p-4">
          {questionLoading ? <Loader width={40} /> : question?.content}
        </h1>
        <textarea
          required
          onChange={(e) => setAnswer(e.target.value)}
          className={`mt-6 w-[90%] h-32 p-4 text-lg font-medium text-gray-900 placeholder-gray-500 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-none focus-visible:ring-opacity-75  
               ${submitAnswer.data?.error ? " ring-2 ring-red-600" : ""}
          `}
          placeholder={`${submitAnswer.data?.error ? "Answer is required!" : "The answer is..."}`}
        />
        <Progress
          value={submitAnswer.data?.percentage || 0}
          className="w-[60%] mt-4"
        />
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {submitAnswer.data?.isAcceptable ? (
            <SubmitForm
              answer={acceptedAnswer}
              isAcceptable={submitAnswer.data.isAcceptable}
              questionId={question?.id || ""}
            />
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitAnswer.isPending}
              type="submit"
              className="text-lg bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600 w-24 h-10"
            >
              {submitAnswer.isPending ? <Loader width={30} /> : "Submit"}
            </Button>
          )}
        </div>
        <AnswerFeedback
          loading={submitAnswer.isPending}
          text={submitAnswer.data?.text || ""}
          isAcceptable={submitAnswer.data?.isAcceptable || false}
        />
      </div>
      <HowTo />
    </div>
  );
}

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <PageContent />
    </QueryClientProvider>
  );
}
