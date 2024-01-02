"use client";

import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

const Home = () => {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <>
      <div className="h-[75dvh] flex flex-col gap-4">
        <TopBar />
        <div className="flex flex-col flex-grow items-center justify-center gap-4 md:gap-8">
          <div className="text-3xl lg:text-4xl xl:text-5xl leading-snug">
            <span className="font-bold">Intelligent search</span> for{" "}
            <span className="text-primary">busy researchers.</span>
          </div>
          <div className="w-full sm:w-4/5 lg:w-3/5">
            <div className="border border-dark dark:border-light flex items-center gap-1 p-1 rounded-xl w-full">
              <input
                ref={ref}
                type="text"
                placeholder="Search for any topic..."
                className="p-2 bg-light dark:bg-dark outline-none flex-grow"
                maxLength={200}
              />
              <Button className="flex items-center justify-center gap-1.5 w-10 p-0 sm:w-fit sm:px-4 sm:py-2">
                <Search className="h-3.5 w-3.5 mb-0.5" />
                <span className="hidden sm:block">Search</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
