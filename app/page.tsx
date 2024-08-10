"use client";
import axios from "axios";
import { CircleChevronRight, LoaderCircle } from "lucide-react";
import Markdown from "react-markdown";
import { useState } from "react";

type Data = {
  text: string;
  isAcceptable: boolean;
  error?: string;
};

export default function Example() {
  const [data, setData] = useState<Data>({
    text: "",
    isAcceptable: false,
  });
  console.log(data);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/answer", { answer: answer });
      setData(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl py-28  ">
      <div className="text-center flex justify-center items-center flex-col">
        <div className="relative w-max rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          Answer the question and we&#39;ll answer your&#39;s
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-indigo-600 p-4">
          How many cows Are on the moon ?
        </h1>
        <textarea
          required
          onChange={(e) => setAnswer(e.target.value)}
          className={`mt-6 w-full h-32 p-4 text-lg font-medium text-gray-900 placeholder-gray-500 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-none focus-visible:ring-opacity-75 backdrop-blur-2xl 
               ${data?.error ? " ring-2 ring-red-600" : ""}
                                    `}
          placeholder={`${data?.error ? "Answer is required!" : "The answer is..."}`}
        />
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {data.isAcceptable ? (
            <button className="flex gap-1 items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-24 h-12">
              Next <CircleChevronRight />
            </button>
          ) : (
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-24 h-12"
            >
              {loading ? (
                <LoaderCircle className="mx-auto animate-spin duration-[10000] " />
              ) : (
                "Submit"
              )}
            </button>
          )}
        </div>
        <span
          className={`p-4 flex items-center justify-center mt-8 rounded-md ${data.text ? "border border-dashed border-slate-400" : ""}`}
        >
          <Markdown className=" flex gap-1 text-lg font-semibold text-gray-900 ">
            {data.error ? null : data.text.split('"')[2]}
          </Markdown>
          {data.isAcceptable ? "👍" : null}
        </span>
      </div>
    </div>
  );
}
