import { CalendarDays } from "lucide-react";
import {
  HoverCard as Hovercard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
      <Popover>
        <HoverCardTrigger asChild>
          <PopoverTrigger asChild>
            <div
              className="p-2 text-xl w-full min-h-full border-dashed border rounded-md shadow hover:bg-indigo-300/20 hover:text-slate-700 hover:shadow-none cursor-help duration-300"
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                height: "auto",
                overflow: "auto",
              }}
            >
              {question}
            </div>
          </PopoverTrigger>
        </HoverCardTrigger>
        <PopoverContent className="w-80">
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
        </PopoverContent>
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
      </Popover>
    </Hovercard>
  );
}
