"use client";

import { FormEvent, useEffect, useRef } from "react";
import { Search } from "lucide-react";
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

    router.push(`/search?q=${ref.current?.value}`);
  };

  return (
    <div className="w-full sm:w-4/5 lg:w-3/5">
      <form
        onSubmit={handleSubmit}
        className="border border-foreground flex items-center gap-1 p-1.5 rounded-[0.9rem] w-full"
      >
        <input
          ref={ref}
          type="text"
          placeholder="Search for any topic..."
          className="p-2 bg-background outline-none flex-grow"
          maxLength={200}
        />
        <Button
          type="submit"
          className="flex items-center justify-center gap-1.5 w-10 p-0 sm:w-fit sm:px-4 sm:py-2"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:block mt-[1.8px]">Search</span>
        </Button>
      </form>
    </div>
  );
};

export default CSearchBar;
