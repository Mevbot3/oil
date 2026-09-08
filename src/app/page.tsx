import { OilField } from "@/components/oil-field";
import { loadMarketSnapshot } from "@/lib/yahoo";

export const dynamic = "force-dynamic";

export default async function Home() {
  const market = await loadMarketSnapshot();
  return <OilField initialMarket={market} />;
}
