"use client";

import { FormEvent, useEffect, useRef } from "react";
import { Info, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const CSearchBar = () => {
  const ref = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!ref.current?.value) {
      // alert("Please enter a search query!");
      return;
    }

    router.push(`/search?q=${ref.current.value}`);
  };

  return (
    <div className="flex flex-col gap-2 w-full sm:w-4/5 lg:w-3/5">
      <form
        onSubmit={handleSubmit}
        className="border border-foreground flex items-center gap-1 p-1.5 rounded-[0.9rem] w-full"
      >
        <input
          ref={ref}
          type="text"
          placeholder="Search for any topic..."
          className="p-2 bg-background outline-none flex-grow"
          maxLength={100}
        />
        <Button
          type="submit"
          className="flex items-center justify-center gap-1.5 w-10 p-0 sm:w-fit sm:px-4 sm:py-2"
        >
          <Search height={14} width={14} />
          <span className="hidden sm:block mt-1">Search</span>
        </Button>
      </form>
      <div className="flex items-baseline w-full gap-2 text-foreground/75">
        <Info height={14} width={14} className="min-w-fit m-auto mt-1.5" />
        <div className="text-sm/loose text-justify">
          {`For optimal results, enter the precise topic you're searching for. For
          instance, if you're looking for scholarly articles on Large Language
          Models, enter "Large Language Models" instead of abbreviations like
          "LLMs."`}
        </div>
      </div>
    </div>
  );
};

export default CSearchBar;
