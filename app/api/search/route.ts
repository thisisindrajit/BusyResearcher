import { IApiResponse } from "@/interfaces/IApiResponse";
import { ChromaClient, DefaultEmbeddingFunction } from "chromadb";
import conn from "@/lib/db";
import { sanitize } from "@/lib/utils";

// Revalidate is set to 0 because the data is changing constantly and so it must be fetched on every request.
export const revalidate = 0;

export interface IScholarlyArticle {
  id: string;
  title: string;
  abstract: string;
  category_ids: string[];
  categories: string[];
  authors: string[];
  published: Date;
  comment?: string;
}

export async function POST(request: Request): Promise<Response> {
  let apiResponse: IApiResponse<IScholarlyArticle[]>;
  const nResults = 10;
  const jsonRequest = await request.json();

  const query: string = jsonRequest.query;
  const exact: boolean = jsonRequest.exact as boolean;

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
    let queryOptions: any = {
      queryTexts: query,
      nResults: nResults,
      include: [],
    };

    if (exact) {
      queryOptions = {
        ...queryOptions,
        whereDocument: {
          $contains: query,
        },
      };
    }

    results = (await collection.query(
      queryOptions
    )).ids[0];

    // NOTE: COMMENTED OUT THIS CODE BECAUSE IT TAKES MORE THAN 10 SECONDS TO EXECUTE AND IS GREATER THAN THE LIMIT OF VERCEL FREE TIER.

    // const resultsWithWhereDocumentFilter = await collection.query({
    //   queryTexts: query,
    //   nResults: nResults,
    //   whereDocument: {
    //     $contains: query,
    //   },
    //   include: [],
    // });

    // // console.log("1", resultsWithWhereDocumentFilter.ids[0]);

    // // If the results with where document are less than half of the required results, then get the rest of the results without the where document.
    // if (
    //   resultsWithWhereDocumentFilter.ids[0].length <= Math.floor(nResults / 2)
    // ) {
    //   const resultsWithoutWhereDocumentFilter = await collection.query({
    //     queryTexts: query,
    //     nResults: nResults,
    //     include: [],
    //   });

    //   // console.log(
    //   //   "2",
    //   //   resultsWithWhereDocumentFilter.ids[0],
    //   //   resultsWithoutWhereDocumentFilter.ids[0]
    //   // );

    //   results = resultsWithWhereDocumentFilter.ids[0].concat(
    //     resultsWithoutWhereDocumentFilter.ids[0]
    //   );
    // } else {
    //   results = resultsWithWhereDocumentFilter.ids[0];
    // }

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

    const preparedStatementPlaceholders: string[] = [];
    const sqlQueryOrderBy: string[] = [];

    for (let i = 1; i <= lenOfResults; i++) {
      preparedStatementPlaceholders.push(`$${i}`);
      sqlQueryOrderBy.push(`WHEN $${i} THEN ${i}`);
    }

    // The query is constructed in this way to ensure that the results are returned in the same order as the results from the ChromaDB query (based on the distances or similarity scores).
    const sqlQuery = `WITH unnested_categories AS (
      SELECT id, unnest(categories) as category_ids
      FROM public.scholarly_articles
      WHERE id in ${`(${preparedStatementPlaceholders.join(",")})`} 
    ),
    extended_aggregated_categories AS (
      SELECT a.id, array_agg(b.category_title) as categories
        FROM unnested_categories a
        INNER JOIN public.arxiv_categories b
        ON a.category_ids = b.id
        GROUP BY a.id
    )
    SELECT b.id, b.title, b.abstract, b.categories as category_ids, a.categories, b.authors, b.published, b.comment 
    FROM extended_aggregated_categories a 
    INNER JOIN public.scholarly_articles b
    ON a.id = b.id
    ORDER BY
    CASE a.id
        ${sqlQueryOrderBy.join("\n")}
      END;
    `;

    // console.log(sqlQuery);

    const res = await conn?.query(sqlQuery, results);

    const resData: IScholarlyArticle[] | undefined = res?.rows;

    resData?.forEach((article) => {
      article.title = sanitize(article.title);
      article.abstract = sanitize(article.abstract);
      article.comment = sanitize(article.comment || "");
    });

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
