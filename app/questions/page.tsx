import Questions from "@/components/questions";

export const metadata = {
  title: "Q & A",
  description: "Questions and answers page",
};

export default function Page() {
  return (
    <main className="flex gap-4 flex-col items-center justify-between p-24">
      <h1 className="text-6xl">Question & Answers</h1>
      <h4 className="text-lg text-gray-400">
        Hover on the question to see the answer
      </h4>
      <Questions />
    </main>
  );
}
