import { HoverCardDemo } from "@/components/hover-card";
import Link from "next/link";

export default function qa() {
  return (
    <main className="flex gap-4 flex-col items-center justify-between p-24">
      <h1 className="text-6xl">Question & Answers</h1>
      <Link href="/">Home</Link>
      <div className="grid grid-cols-6 gap-6">
        {Array.from({ length: 1000 }).map((_, i) => (
          <HoverCardDemo key={i} />
        ))}
      </div>
    </main>
  );
}
