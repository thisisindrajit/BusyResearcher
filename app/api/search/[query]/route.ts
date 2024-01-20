import { IApiResponse } from "@/interfaces/IApiResponse";
import conn from "@/lib/db";
import { ChromaClient, DefaultEmbeddingFunction } from "chromadb";

// Revalidate is set to 0 because the data is changing constantly and so it must be fetched on every request.
export const revalidate = 0;

export interface ISearchResultsData {
  id: string;
  title: string;
  abstract: string;
  categories: string[];
  authors: string[];
  published: Date;
  is_embedding_created: boolean;
  added_at: Date;
  comment?: string;
}

export async function GET(
  request: Request,
  { params }: { params: { query: string } }
): Promise<Response> {
  let apiResponse: IApiResponse<ISearchResultsData[]>;
  const nResults = 10;
  const query = params.query;

  // If the query is empty, return a 400.
  if (!query || query.length === 0) {
    apiResponse = {
      success: false,
      message: "No query provided!",
      data: [],
      respondedAt: new Date().toUTCString(),
    };

    return Response.json(apiResponse, { status: 400 });
  }

  // Get the results from the database.
  try {
    const client = new ChromaClient({
      path: process.env.CHROMADB_HOST_URL,
      auth: {
        provider: "token",
        credentials: process.env.CHROMA_CLIENT_AUTH_CREDENTIALS,
      },
    });

    const collection = await client.getCollection({
      name: process.env.CHROMADB_COLLECTION_NAME || "busyresearcher",
      embeddingFunction: new DefaultEmbeddingFunction(),
    });

    let results: string[] = [];

    const resultsWithWhereDocument = await collection.query({
      queryTexts: query,
      nResults: nResults,
      whereDocument: {
        $contains: query,
      },
      include: [],
    });

    // console.log("NR 1", resultsWithWhereDocument.ids[0].length);

    // If the results with where document are less than half of the required results, then get the rest of the results without the where document.
    if (resultsWithWhereDocument.ids[0].length <= Math.floor(nResults / 2)) {
      const resultsWithoutWhereDocument = await collection.query({
        queryTexts: query,
        nResults: nResults,
        include: [],
      });

      // console.log("NR 2", resultsWithoutWhereDocument.ids[0].length);

      results = resultsWithWhereDocument.ids[0].concat(
        resultsWithoutWhereDocument.ids[0]
      );
    } else {
      results = resultsWithWhereDocument.ids[0];
    }
    
    const lenOfResults = results.length;

    // If no results are found, return a 404.
    if (lenOfResults === 0) {
      apiResponse = {
        success: true,
        message: `No results found for query - ${query}`,
        data: [],
        respondedAt: new Date().toUTCString(),
      };

      return Response.json(apiResponse, { status: 404 });
    }

    const preparedStatementPlaceholders = [];

    for (let i = 1; i <= lenOfResults; i++) {
      preparedStatementPlaceholders.push(`$${i}`);
    }

    const sqlQuery = `SELECT * FROM public.scholarly_articles 
    WHERE id in ${`(${preparedStatementPlaceholders.join(",")})`}`;

    const res = await conn?.query(sqlQuery, results);

    const resData: ISearchResultsData[] | undefined = res?.rows;

    apiResponse = {
      success: true,
      message: `Results for query - ${query} (Result count - ${lenOfResults}))`,
      data: resData || [],
      respondedAt: new Date().toUTCString(),
    };

    return Response.json(apiResponse, { status: 200 });
  } catch (error) {
    apiResponse = {
      success: false,
      message: `Error while getting results from the database: ${error}`,
      data: [],
      respondedAt: new Date().toUTCString(),
    };

    return Response.json(apiResponse, { status: 500 });
  }
}
