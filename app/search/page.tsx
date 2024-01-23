"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { IScholarlyArticle } from "../api/search/route";
import { IApiResponse } from "@/interfaces/IApiResponse";
import LoadingHolder from "@/components/holders/LoadingHolder";
// import { Separator } from "@/components/ui/separator";
import TopBar from "@/components/common/TopBar";
import ScholarlyArticleCard from "@/components/scholarly-article-card/ScholarlyArticleCard";
import Footer from "@/components/common/Footer";
import CSearchBar from "@/components/common/CSearchBar";
import { Separator } from "@/components/ui/separator";

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
    return (
      <LoadingHolder>
        Semantically searching 🤔 for{" "}
        <span className="text-primary font-bold">{query}</span>
      </LoadingHolder>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <TopBar />
      <div className="flex flex-col gap-4">
        <CSearchBar
          query={query || undefined}
          exact={exact === "1" ? true : false}
          fullWidth
        />
        <Separator className="bg-gradient-to-r from-background via-secondary to-background my-2" />
        <div className="flex flex-col gap-1 mb-2">
          <div className="text-2xl/relaxed">
            Search results for{" "}
            <span className="text-primary font-bold">{query}</span>
          </div>
          {searchResults.data.length > 0 && (
            <div className="font-bold text-sm text-secondary">
              Showing {searchResults.data.length}{" "}
              {searchResults.data.length > 1 ? "results" : "result"}
            </div>
          )}
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
      <Footer />
    </>
  );
};

export default Search;
