"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { ISearchResultsData } from "../api/search/[query]/route";
import { IApiResponse } from "@/interfaces/IApiResponse";
import LoadingHolder from "@/components/holder/LoadingHolder";
import { Separator } from "@/components/ui/separator";
import TopBar from "@/components/TopBar";
import Latex from "react-latex-next";
import { convertToPrettyDateFormat } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

const Search = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const getSearchResults = async (
    query: string
  ): Promise<IApiResponse<ISearchResultsData[]>> => {
    // We need to provide the full URL here because this function is called in the server
    const apiResponse = await fetch(`api/search/${query}`);

    const jsonResponse: IApiResponse<ISearchResultsData[]> =
      await apiResponse.json();

    if (!jsonResponse.success) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error(
        jsonResponse.message ||
          "Some error occurred while fetching search results data!"
      );
    }

    return jsonResponse;
  };

  const {
    isPending,
    data: searchResults,
    isError,
    error,
  } = useQuery<IApiResponse<ISearchResultsData[]>>({
    queryKey: ["search", query || ""],
    queryFn: ({ queryKey }) => getSearchResults(queryKey[1] as string),
  });

  if (isPending) {
    return <LoadingHolder text={`Semantically searching for "${query}"...`} />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <TopBar />
      <div>
        <div className="text-2xl">
          Search results for{" "}
          <span className="text-primary font-bold">{query}</span>
        </div>
        <Separator className="my-4 bg-primary" />
        <div className="flex flex-col gap-4">
          {searchResults.data.map((d) => {
            return (
              <div
                className="flex flex-col gap-4 border border-foreground/30 dark:border-foreground/25 rounded-md p-6 backdrop-blur-md bg-light-foreground/5"
                key={d.id}
              >
                <div className="flex flex-col gap-2">
                  <a
                    href={`${process.env.NEXT_PUBLIC_ARXIV_BASE_URL}/${d.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl text-primary font-bold hover:underline w-fit"
                  >
                    <Latex>{d.title}</Latex>
                  </a>
                  {d.authors.length > 0 && (
                    <div className="leading-loose">
                      {d.authors.map((a, index) => {
                        return (
                          <span key={index} className="font-bold">
                            {a}
                            {index !== d.authors.length - 1 && ", "}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {d.published && (
                    <div className="text-xs flex gap-2 items-center w-fit font-bold text-secondary">
                      <CalendarDays
                        height={14}
                        width={14}
                        className="min-w-fit mb-[3.5px]"
                      />
                      {convertToPrettyDateFormat(d.published)}
                    </div>
                  )}
                </div>
                <div className="text-justify leading-loose text-foreground/80 dark:text-foreground/70">
                  <Latex>{d.abstract}</Latex>
                </div>
                {d.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {d.categories.map((c, index) => {
                      return (
                        <Link
                          href={`/category/${d.category_ids[index]}`}
                          target="_blank"
                          key={index}
                          className="text-primary text-xs border border-primary font-bold rounded-lg p-2"
                        >
                          {c}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Search;
