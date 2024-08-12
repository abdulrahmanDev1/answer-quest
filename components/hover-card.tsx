import { CalendarDays } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard as Hovercard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function HoverCard({
  question,
  answer,
  answeredBy,
  answeredAt,
}: {
  question: string;
  answer: string;
  answeredBy: string;
  answeredAt: string;
}) {
  return (
    <Hovercard>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          className="p-2 text-xl w-full border-dashed border hover:bg-indigo-300/50"
        >
          {question}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-xl font-semibold">
              <span className="text-lg text-gray-600">By: </span>
              {answeredBy}
            </h4>
            <p className="text-lg">{answer}</p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-sm text-muted-foreground">
                {answeredAt}{" "}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </Hovercard>
  );
}
