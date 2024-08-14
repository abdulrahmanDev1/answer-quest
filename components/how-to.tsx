import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import React from "react";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";

const initialHowTos = [
  {
    title: "1. Answer the Question",
    description:
      "Read the question displayed on the screen. Try to answer it to the best of your ability. It might be challenging, but give it your best shot!",
  },
  {
    title: "2. Fill Out the Form",
    description:
      'If you answer the question correctly, a "Next" button will appear. Click this button to proceed to a form where you\'ll need to provide your name, email, and the question you want to ask.',
  },
  {
    title: "3. Confirm Your Email",
    description:
      "After submitting the form, you'll receive an email with a confirmation button. Click this button to confirm your question submission. Once confirmed, your question will be added to the page as the next challenge!",
  },
  {
    title: "What next?",
    description:
      "If someone answered your question you will receive an email with the answer. You can then try answer their question and the cycle continues.",
  },
];

export default function HowTo() {
  const [howTos, setHowTos] = React.useState(
    initialHowTos.map((howTo) => ({ ...howTo, isOpen: false })),
  );

  const handleOpen = (index: number) => {
    setHowTos(
      howTos.map((howTo, i) => ({
        ...howTo,
        isOpen: i === index ? !howTo.isOpen : false,
      })),
    );
  };
  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="mx-auto flex items-center justify-center mt-4 md:mt-10 lg:mt-28 "
      >
        <Button variant="link">How to ?..</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>How to ?..</DialogTitle>
          <DialogDescription>How it works</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 items-center">
          <div className="flex flex-col gap-4 items-center">
            {howTos.map((howTo, index) => (
              <Popover key={index} open={howTo.isOpen}>
                <PopoverTrigger asChild className="w-full">
                  <Button
                    variant="ghost"
                    className="font-semibold w-full"
                    onClick={() => handleOpen(index)}
                  >
                    {howTo.title}{" "}
                    {howTo.isOpen ? (
                      <Eye className="px-2" width={30} />
                    ) : (
                      <EyeOff className="px-2" width={30} />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <h2 className="font-bold pb-2">{howTo.title}</h2>
                  {howTo.description}
                </PopoverContent>
              </Popover>
            ))}
            <p className="text-center">Have fun and enjoy the challenge! :)</p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="default" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
