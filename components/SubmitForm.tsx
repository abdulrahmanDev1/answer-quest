import { CircleChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { env } from "@/env";
import { sendEmail } from "@/lib/send-email";
import { Button } from "./ui/button";

export type FormData = {
  email: string;
  question: string;
  name: string;
};

export type EmailProps = {
  name: string;
  question: string;
  answer: string;
  answerCreatedAt: string;
  submitUrl: string;
  email: string;
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

function encodeUrlParams(
  baseURL: string,
  question: string,
  answer: string,
  answeredQuestion: string,
  email: string,
  name: string,
): string {
  let urlObj = new URL(baseURL);

  urlObj.searchParams.set("question", encodeURIComponent(question));
  urlObj.searchParams.set("answer", encodeURIComponent(answer));
  urlObj.searchParams.set("email", encodeURIComponent(email));
  urlObj.searchParams.set("name", encodeURIComponent(name));
  urlObj.searchParams.set("answeredQuestion", answeredQuestion);

  return urlObj.toString();
}

type SubmitFormProps = {
  answer: string;
  questionId: string;
  isAcceptable?: boolean;
};

export const SubmitForm = ({
  answer,
  questionId,
  isAcceptable,
}: SubmitFormProps) => {
  const hostname = env.NEXT_PUBLIC_HOSTNAME;
  const baseURL = hostname + "/api/submit";
  function onSubmit(
    data: FormData,
    answer: string,
    setOpen: (open: boolean) => void,
    reset: () => void,
  ) {
    const emailUrl = encodeUrlParams(
      baseURL,
      data.question,
      answer,
      questionId,
      data.email,
      data.name,
    );

    setOpen(false);
    if (isAcceptable) {
      try {
        sendEmail({
          name: data.name,
          question: data.question,
          answer: answer,
          submitUrl: emailUrl,
          email: data.email,
          answerCreatedAt: new Date().toLocaleString(),
        });
        toast.success("Check your email! 📬 (check spam too)");
      } catch (e) {
        // console.log(e);
        toast.error("Failed to send email");
      }
    } else {
      toast.error("Your answer is not acceptable");
    }

    reset();
  }
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex gap-1 items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-24 h-12">
          Next <CircleChevronRight />
        </button>
      </DialogTrigger>
      <DialogContent className="z-50">
        <DialogHeader>
          <DialogTitle>Confirm your answer</DialogTitle>
          <DialogDescription>
            Confirm your answer and ask a question yourself!{" "}
          </DialogDescription>
        </DialogHeader>
        <form
          className="my-8"
          method="POST"
          onSubmit={handleSubmit((data) =>
            onSubmit(data, answer, setOpen, reset),
          )}
        >
          <LabelInputContainer className="mb-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Tyler Durden"
              type="text"
              {...register("name", {
                required: "Name is required",
                maxLength: {
                  value: 30,
                  message: "Name cannot be more than 30 characters",
                },
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
            {errors.name && (
              <div className="text-red-500">{errors.name.message}</div>
            )}
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="tylerdurden@fc.com"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
          </LabelInputContainer>

          <LabelInputContainer className="mb-8">
            <Label htmlFor="message">Your Question</Label>
            <Textarea
              id="question"
              placeholder="What is..."
              {...register("question", {
                required: "Question is required",
                maxLength: {
                  value: 200,
                  message: "Question cannot be more than 200 characters",
                },
                minLength: {
                  value: 10,
                  message: "Question must be at least 10 characters",
                },
                validate: (value) =>
                  value.endsWith("?") ||
                  "Question must end with a question mark",
              })}
            />
            {errors.question && (
              <div className="text-red-500">{errors.question.message}</div>
            )}
          </LabelInputContainer>

          <Button
            type="submit"
            className="group relative w-full flex justify-center  border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          >
            Submit
            <BottomGradient />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
