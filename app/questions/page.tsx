import Questions from "@/components/questions";

export const metadata = {
  title: "Answer quest | Q & A",
  description: "Questions and answers page",
};

export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <main className="flex gap-4 flex-col items-center justify-between px-4 md:px-12 lg:px-24">
      <h1 className="lg:text-6xl md:text-4xl text-3xl">Question & Answers</h1>
      <h4 className="text-md md:textlg lg:text-xl text-gray-400">
        Hover/Click the question to see the answer
      </h4>
      <Questions />
    </main>
  );
}
