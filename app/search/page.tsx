"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { IScholarlyArticle } from "../api/search/route";
import { IApiResponse } from "@/interfaces/IApiResponse";
import LoadingHolder from "@/components/holders/LoadingHolder";
// import { Separator } from "@/components/ui/separator";
import TopBar from "@/components/common/TopBar";
import ScholarlyArticleCard from "@/components/scholarly-article-card/ScholarlyArticleCard";
import Footer from "@/components/common/Footer";
import CSearchBar from "@/components/common/CSearchBar";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query: string | undefined = searchParams.get("q")?.trim();
  const exact: boolean = searchParams.get("exact") === "1";

  const getSearchResults = async (): Promise<
    IApiResponse<IScholarlyArticle[]>
  > => {
    // If query is not available or is empty, throw an error
    if (!query || query.length === 0) {
      throw new Error("No search query provided!");
    }

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
    // error,
  } = useQuery<IApiResponse<IScholarlyArticle[]>>({
    // here query is made to lower case to avoid case sensitivity
    queryKey: ["search", query?.toLowerCase(), exact],
    queryFn: ({ queryKey }) => getSearchResults(),
    retry: 3, // Retry 3 times before failing
  });

  if (isPending) {
    return (
      <LoadingHolder>
        Semantically searching 🤔 for{" "}
        <span className="text-primary font-bold">{query || "🫤"}</span>
        {exact && " with exact matches"}
      </LoadingHolder>
    );
  }

  if (isError) {
    router.replace("/error");

    return null;
  }

  return (
    <>
      <TopBar />
      <div className="flex flex-col gap-4">
        <CSearchBar query={query} exact={exact} fullWidth />
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
              {exact && " (Exact query matches only)"}
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
