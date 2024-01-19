"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { ISearchResultsData } from "../api/search/[query]/route";
import { IApiResponse } from "@/interfaces/IApiResponse";
import LoadingHolder from "@/components/holder/LoadingHolder";
import { Separator } from "@/components/ui/separator";
import TopBar from "@/components/TopBar";

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
        {searchResults.data.map((d) => {
          return (
            <div key={d.id}>
              {d.id} - {d.title}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Search;
