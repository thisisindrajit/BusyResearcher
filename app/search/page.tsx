"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { IScholarlyArticle } from "../api/search/route";
import { IApiResponse } from "@/interfaces/IApiResponse";
import LoadingHolder from "@/components/holder/LoadingHolder";
import { Separator } from "@/components/ui/separator";
import TopBar from "@/components/TopBar";
import ScholarlyArticleCard from "@/components/ScholarlyArticleCard";

const Search = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const exact = searchParams.get("exact");

  const getSearchResults = async (
    query: string
  ): Promise<IApiResponse<IScholarlyArticle[]>> => {
    // We need to provide the full URL here because this function is called in the server
    const apiResponse = await fetch(`api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, exact }),
    });

    const jsonResponse: IApiResponse<IScholarlyArticle[]> =
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
  } = useQuery<IApiResponse<IScholarlyArticle[]>>({
    queryKey: ["search", query?.toLowerCase() || "", exact ? exact : "0"],
    queryFn: ({ queryKey }) => getSearchResults(queryKey[1] as string),
    retry: 3, // Retry 3 times before failing
  });

  if (isPending) {
    return <LoadingHolder text={`Semantically searching 🤔 for "${query}"`} />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <TopBar />
      <div className="flex flex-col gap-4">
        <div className="text-2xl/relaxed">
          Search results for{" "}
          <span className="text-primary font-bold">{query}</span>
        </div>
        {/* <Separator className="my-4 bg-primary" /> */}
        <div className="flex flex-col gap-4">
          {searchResults.data.length === 0 && (
            <div className="my-4 text-center text-destructive m-auto font-bold">
              No results found!
            </div>
          )}
          {searchResults.data.map((d: IScholarlyArticle) => {
            return <ScholarlyArticleCard key={d.id} data={d} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Search;
