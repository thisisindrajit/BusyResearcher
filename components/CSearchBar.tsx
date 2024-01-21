"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Info, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Checkbox } from "./ui/checkbox";

const CSearchBar = () => {
  const maxQueryLength = 200;
  const ref = useRef<HTMLInputElement | null>(null);
  const [
    showArticlesWithExactMatchesFilter,
    setShowArticlesWithExactMatchesFilter,
  ] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = () => {
    setShowArticlesWithExactMatchesFilter(!showArticlesWithExactMatchesFilter);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!ref.current?.value) {
      // alert("Please enter a search query!");
      return;
    }

    router.push(
      `/search?q=${ref.current.value
        .trim()
        .substring(0, maxQueryLength + 1)}&exact=${
        showArticlesWithExactMatchesFilter ? "1" : "0"
      }`
    );
  };

  useEffect(() => {
    ref.current?.focus();
  }, []);

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
          maxLength={maxQueryLength}
        />
        <Button
          type="submit"
          className="flex items-center justify-center gap-1.5 w-10 p-0 sm:w-fit sm:px-4 sm:py-2"
        >
          <Search height={14} width={14} />
          <span className="hidden sm:block mt-1">Search</span>
        </Button>
      </form>
      <div className="flex items-start gap-2">
        <Checkbox
          id="filter"
          className="mt-1"
          checked={showArticlesWithExactMatchesFilter}
          onCheckedChange={handleChange}
        />
        <label
          htmlFor="filter"
          className="text-sm/loose peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none cursor-pointer"
        >
          Show only articles with exact query matches (Only articles which
          contain the exact query in their title or abstract will be shown)
        </label>
      </div>
    </div>
  );
};

export default CSearchBar;
