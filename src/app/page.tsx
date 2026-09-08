import { OilTerminal } from "@/components/oil-terminal";
import { loadMarketSnapshot } from "@/lib/yahoo";

export const dynamic = "force-dynamic";

export default async function Home() {
  const market = await loadMarketSnapshot();
  return <OilTerminal initialMarket={market} />;
}
