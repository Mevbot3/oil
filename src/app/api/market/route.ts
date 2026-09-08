import { loadMarketSnapshot } from "@/lib/yahoo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const market = await loadMarketSnapshot();
    return Response.json(market, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Field report failed";
    return Response.json({ error: message }, { status: 502 });
  }
}
