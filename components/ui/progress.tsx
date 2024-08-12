"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(
            "relative h-4 w-full overflow-hidden rounded-full bg-gradient-to-r from-red-500 to-green-500",
            className,
          )}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className="h-full w-full flex-1 bg-secondary transition-all"
            style={{ transform: `translateX(${100 - (100 - value! || 100)}%)` }}
          />
        </ProgressPrimitive.Root>
      </TooltipTrigger>
      <TooltipContent>
        <p>Satisfaction with your answer</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
