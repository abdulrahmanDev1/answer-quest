"use client";
import axios from "axios";
import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { SubmitForm } from "@/components/SubmitForm";
import { Progress } from "@/components/ui/progress";
import HowTo from "@/components/how-to";

type Data = {
  text: string;
  isAcceptable: boolean;
  precentage: number;
  error?: string;
};

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
  const [question, setQuestion] = useState<string>("");
  const [questionLoading, setQuestionLoading] = useState(true);
  useEffect(() => {
    const fetchQuestion = async () => {
      setQuestionLoading(true);
      const getQuestion = await axios.get("/api/question");
      const question = getQuestion.data.content;
      setQuestion(question);
      setQuestionLoading(false);
    };
    fetchQuestion();
  }, []);

  const [data, setData] = useState<Data>({
    text: "",
    precentage: 0,
    isAcceptable: false,
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [answer, setAnswer] = useState("");
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/answer", {
        question: question,
        answer: answer,
      });
      setData(response.data);
      setProgress(response.data.precentage);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl py-4 md:py-16 lg:py-28 z-50  ">
      <div className="text-center flex justify-center items-center flex-col">
        <div className="relative w-max rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          Answer the question{" "}
          <span className="text-xs text-gray-400">*if you can</span> and
          we&#39;ll answer your&#39;s
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-indigo-600 p-4">
          {questionLoading ? <Loader width={40} /> : question}
        </h1>
        <textarea
          required
          onChange={(e) => setAnswer(e.target.value)}
          className={`mt-6  w-[90%] h-32 p-4 text-lg font-medium text-gray-900 placeholder-gray-500 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-none focus-visible:ring-opacity-75  
               ${data?.error ? " ring-2 ring-red-600" : ""}
                                    `}
          placeholder={`${data?.error ? "Answer is required!" : "The answer is..."}`}
        />
        <Progress value={progress} className="w-[60%] mt-4" />
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {data.isAcceptable ? (
            <SubmitForm answer={answer} isAcceptable={data.isAcceptable} />
          ) : (
            <Button
              onClick={() => fetchData()}
              disabled={loading}
              className=" bg-indigo-600  hover:bg-indigo-500 focus-visible:outline-indigo-600 w-24 h-12"
            >
              {loading ? <Loader width={30} /> : "Submit"}
            </Button>
          )}
        </div>
        <span
          className={`p-4 mx-2 items-center justify-center mt-8 rounded-md h-auto ${data.text ? "border border-dashed border-slate-400" : ""}`}
        >
          <Markdown className=" flex gap-1 text-lg font-semibold text-gray-900 ">
            {data.error ? null : data.text.split("}")[1]}
          </Markdown>
          {data.isAcceptable ? "👍" : null}
        </span>
      </div>
      <HowTo />
    </div>
  );
}
