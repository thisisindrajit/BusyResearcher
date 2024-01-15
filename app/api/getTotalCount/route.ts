export const revalidate = 0;

import { IApiResponse } from "@/interfaces/IApiResponse";
import conn from "@/lib/db";

export interface ITotalCountData {
  count?: number;
}

export async function GET(): Promise<Response> {
  let apiResponse: IApiResponse<ITotalCountData>;

  try {
    if (!conn) {
      apiResponse = {
        success: false,
        message: "Error while fetching total count: Connection to database failed!",
        data: {
          count: undefined
        },
        respondedAt: new Date().toLocaleString()
      };

      return Response.json(apiResponse, { status: 500 });
    }
    const query = "SELECT SUM(total_ingested) FROM public.arxiv_categories;";

    const res = await conn.query(query);

    apiResponse = {
      success: true,
      message: "Total count of scholarly articles ingested",
      data: {
        count: res.rows[0].sum,
      },
      respondedAt: new Date().toLocaleString()
    };

    return Response.json(apiResponse, { status: 200 });
  } catch (error) {
    apiResponse = {
      success: false,
      message: `Error while fetching total count: ${error}`,
      data: {
        count: undefined
      },
      respondedAt: new Date().toUTCString()
    };

    return Response.json(apiResponse, { status: 500 });
  }
}
