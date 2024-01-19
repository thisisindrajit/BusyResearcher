import { IApiResponse } from "@/interfaces/IApiResponse";
import conn from "@/lib/db";
import { sanitize } from "@/lib/utils";
import {
  ChromaClient,
  DefaultEmbeddingFunction
} from "chromadb";

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
  // Sanitize the query to prevent XSS attacks.
  const query = sanitize(params.query.trim());

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

    const results = await collection.query({
      queryTexts: query,
      nResults: 10,
      include: [],
    });

    const sqlQuery = `SELECT * FROM public.scholarly_articles 
    WHERE id in ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ORDER BY published DESC;`;

    const res = await conn?.query(sqlQuery, results.ids[0]);

    const resData: ISearchResultsData[] | undefined = res?.rows;

    apiResponse = {
      success: true,
      message: `Results for query - ${query}`,
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
