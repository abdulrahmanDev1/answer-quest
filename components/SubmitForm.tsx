import { CircleChevronRight, MailIcon, SendIcon } from "lucide-react";
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
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export type FormData = {
  email: string;
  question: string;
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
  email: string,
): string {
  const urlObj = new URL(baseURL);

  urlObj.searchParams.set("question", encodeURIComponent(question));
  urlObj.searchParams.set("answer", encodeURIComponent(answer));
  urlObj.searchParams.set("email", encodeURIComponent(email));

  return urlObj.toString();
}

function sendEmail(data: string) {}

const baseURL = "localhost:3000/api/submit";

function onSubmit(
  data: FormData,
  answer: string,
  setOpen: (open: boolean) => void,
  reset: () => void,
) {
  const emailUrl = encodeUrlParams(baseURL, data.question, answer, data.email);
  // sendEmail(emailUrl);
  console.log(emailUrl);
  toast.success("Check your email!");
  setOpen(false);
  reset();
}

type SubmitFormProps = {
  answer: string;
};

export const SubmitForm = ({ answer }: SubmitFormProps) => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex gap-1 items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-24 h-12">
          Next <CircleChevronRight />
        </button>
      </DialogTrigger>
      <DialogContent className="z-50">
        <DialogHeader>
          <DialogTitle>Send me an email</DialogTitle>
          <DialogDescription>
            Send me an email and I will get back to you as soon as possible.
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
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="tylerdurden@fc.com"
              type="email"
              required
              {...register("email")}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="message">Your Question</Label>
            <Textarea
              id="question"
              placeholder="What is..."
              required
              {...register("question")}
            />
          </LabelInputContainer>

          <button
            className=" flex items-center justify-center gap-2 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600  dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Submit
            <BottomGradient />
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
