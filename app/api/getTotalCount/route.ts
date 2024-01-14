import conn from "@/lib/db";

export async function GET(): Promise<Response> {
  try {
    const query = "SELECT SUM(total_ingested) FROM public.arxiv_categories;";
    if (conn) {
      const res = await conn.query(query);

      return Response.json({ count: res.rows[0].sum });
    } else {
      return Response.json({ error: "Connection to database failed" });
    }
  } catch (error) {
    return Response.json({ error: error });
  }
}
