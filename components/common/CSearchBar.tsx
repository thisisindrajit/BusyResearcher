"use client";

import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { Info, Search } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

interface CSearchBarProps {
  query?: string;
  exact?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const CSearchBar: FC<CSearchBarProps> = ({
  query,
  exact,
  className,
  fullWidth = false,
}) => {
  const maxQueryTextLength = 200;
  // const [queryText, setQueryText] = useState<string>(query || "");
  const ref = useRef<HTMLInputElement>(null);
  const [
    showArticlesWithExactMatchesFilter,
    setShowArticlesWithExactMatchesFilter,
  ] = useState<boolean>(exact || false);
  const router = useRouter();

  const handleChange = () => {
    setShowArticlesWithExactMatchesFilter(!showArticlesWithExactMatchesFilter);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedQueryText =
      ref.current?.value.trim().substring(0, maxQueryTextLength + 1) || "";

    if (formattedQueryText.length === 0) {
      // alert("Please enter a search query!");
      return;
    }

    router.push(
      `/search?q=${formattedQueryText}&exact=${
        showArticlesWithExactMatchesFilter ? "1" : "0"
      }`
    );
  };

  // NOTE: Focus on the search bar on page load
  // useEffect(() => {
  //   ref.current?.focus();
  // }, []);

  useEffect(() => {
    // setQueryText(query || "");
    if (ref && ref.current) {
      ref.current.value = query || "";
    }

    setShowArticlesWithExactMatchesFilter(exact || false);
  }, [query, exact]);

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        fullWidth ? "w-full" : "w-full sm:w-4/5 lg:w-3/5",
        className
      )}
    >
      <form
        onSubmit={handleSubmit}
        className="border border-foreground flex items-center gap-1 p-1.5 rounded-[0.9rem] w-full"
      >
        <input
          ref={ref}
          type="text"
          placeholder="Search for any topic..."
          className="p-2 bg-background outline-none flex-grow"
          maxLength={maxQueryTextLength}
          // value={queryText}
          // onChange={(e) => setQueryText(e.target.value)}
        />
        <Button
          type="submit"
          className="flex items-center justify-center gap-1.5 w-10 p-0 sm:w-fit sm:px-4 sm:py-2"
        >
          <Search height={14} width={14} />
          <span className="hidden sm:block mt-[2px]">Search</span>
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
          Show articles with exact query matches (Only articles which contain
          the exact query in their title or abstract will be shown)
        </label>
      </div>
    </div>
  );
};

export default CSearchBar;
