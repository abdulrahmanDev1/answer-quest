"use client";
import React from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Error() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const error = searchParams.get("error");
  if (!error) {
    router.push("/");
  }
  return (
    <div>
      <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
        <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
          <div className="relative">
            <div className="absolute">
              <div className="">
                <h1 className="my-2 text-gray-800 font-bold text-4xl">
                  Error:{" "}
                </h1>
                <p className="my-2 text-gray-800 text-2xl">{error}</p>
                <Button size="lg" onClick={() => router.push("/")}>
                  Go home
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <img src="https://i.ibb.co/ck1SGFJ/Group.png" />
        </div>
      </div>
    </div>
  );
}
