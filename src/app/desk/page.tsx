import { GusherDashboard } from "@/components/gusher-dashboard";
import { loadMarketSnapshot } from "@/lib/yahoo";

export const dynamic = "force-dynamic";

export default async function DeskPage() {
  const market = await loadMarketSnapshot();
  return <GusherDashboard initialMarket={market} />;
}
