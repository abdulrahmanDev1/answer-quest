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
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import React from "react";
import { Button } from "./ui/button";

export default function HowTo() {
  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="mx-auto flex items-center justify-center mt-10 md:mt-28 lg:mt-36"
      >
        <Button variant="link">How to ?..</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>How to ?..</DialogTitle>
          <DialogDescription>How the game works</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 items-center">
          <div className="flex flex-col gap-4 items-center">
            <Alert>
              <AlertTitle>1. Answer the Question</AlertTitle>
              <AlertDescription>
                Read the question displayed on the screen. Try to answer it to
                the best of your ability. It might be challenging, but give it
                your best shot!
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTitle>2. Fill Out the Form</AlertTitle>
              <AlertDescription>
                If you answer the question correctly, a &#34;Next&#34; button
                will appear. Click this button to proceed to a form where
                you&#39;ll need to provide your name, email, and the question
                you want to ask.
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTitle>3. Confirm Your Email</AlertTitle>
              <AlertDescription>
                After submitting the form, you&#39;ll receive an email with a
                confirmation button. Click this button to confirm your question
                submission. Once confirmed, your question will be added to the
                page as the next challenge!
              </AlertDescription>
            </Alert>

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
