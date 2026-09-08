"use client";

import { useCallback, useEffect, useState } from "react";
import { Droplets, Fuel, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GushChart } from "@/components/gush-chart";
import { BarrelMark } from "@/components/logo";
import { PairTable } from "@/components/pair-table";
import { SwapDesk } from "@/components/swap-desk";
import { TOKEN, type MarketSnapshot } from "@/lib/basket";
import {
  formatCompactUsd,
  formatPercent,
  formatTime,
  formatUsd,
  formatWeight,
} from "@/lib/format";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; market: MarketSnapshot };

const TOKENOMICS = [
  { label: "Liquidity peg reserve", share: "40%" },
  { label: "Community airdrop", share: "25%" },
  { label: "Oil-field treasury", share: "20%" },
  { label: "Team, 18-month lock", share: "15%" },
];

export function GusherDashboard({
  initialMarket,
}: {
  initialMarket: MarketSnapshot;
}) {
  const [state, setState] = useState<LoadState>({
    status: "ready",
    market: initialMarket,
  });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = true) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setState({ status: "loading" });
    }
    try {
      const response = await fetch("/api/market", { cache: "no-store" });
      const payload = (await response.json()) as MarketSnapshot & {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "Field report failed");
      }
      setState({ status: "ready", market: payload });
    } catch (error) {
      setState((current) => {
        if (current.status === "ready") {
          return current;
        }
        return {
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Could not reach the oil-stock tape.",
        };
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void load(true);
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [load]);

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(232,184,74,0.16),_transparent_42%),radial-gradient(circle_at_80%_20%,_rgba(80,40,8,0.45),_transparent_36%)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <Header
          market={state.status === "ready" ? state.market : null}
          refreshing={refreshing}
          onRefresh={() => void load(true)}
        />

        {state.status === "loading" ? <LoadingState /> : null}
        {state.status === "error" ? (
          <ErrorState message={state.message} onRetry={() => void load()} />
        ) : null}
        {state.status === "ready" ? <ReadyState market={state.market} /> : null}

        <footer className="space-y-2 pb-8 text-xs leading-relaxed text-muted-foreground">
          <p>
            $GUSH is a demo meme token. The price is a paper peg against a
            weighted basket of oil-major equities, not a live on-chain market.
            Quotes come from Yahoo Finance when the tape is reachable; otherwise
            the last known field prices are used. This is not financial advice
            and not an offer to sell securities or tokens.
          </p>
        </footer>
      </div>
    </div>
  );
}

function Header({
  market,
  refreshing,
  onRefresh,
}: {
  market: MarketSnapshot | null;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <BarrelMark className="size-12 shrink-0" />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-heading text-2xl tracking-tight text-amber-100">
              GUSHER
            </p>
            <Badge className="bg-amber-400 text-zinc-950">{TOKEN.symbol}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{TOKEN.tagline}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {market ? (
          <p className="font-mono text-sm text-amber-100/90">
            {TOKEN.symbol} {formatUsd(market.price, true)}
          </p>
        ) : null}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={refreshing ? "animate-spin" : ""} />
          Refresh tape
        </Button>
      </div>
    </header>
  );
}

function ReadyState({ market }: { market: MarketSnapshot }) {
  const up = market.changePercent >= 0;

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="border-amber-400/20 bg-zinc-950/60">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-amber-400/40 text-amber-200">
                Paired to oil stocks
              </Badge>
              <Badge
                variant="outline"
                className={
                  market.source === "live"
                    ? "border-emerald-500/30 text-emerald-300"
                    : "border-amber-500/30 text-amber-200"
                }
              >
                {market.source === "live" ? "Live tape" : "Fallback field prices"}
              </Badge>
            </div>
            <CardTitle className="font-heading mt-4 text-5xl tracking-tight text-amber-100 sm:text-7xl">
              {formatUsd(market.price, true)}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-3 text-base">
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  up ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {up ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
                {formatPercent(market.changePercent)} today
              </span>
              <span>Updated {formatTime(market.asOf)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <Stat
              label="Paper market cap"
              value={formatCompactUsd(market.marketCap)}
            />
            <Stat
              label="Oil-stock basket"
              value={formatUsd(market.basketValue)}
            />
            <Stat label="Supply" value="1.0B GUSH" />
          </CardContent>
        </Card>

        <Card className="border-amber-400/15 bg-zinc-950/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="size-4 text-amber-300" />
              Field report
            </CardTitle>
            <CardDescription>
              WTI sits next to the peg as a crude check, not inside the
              formula.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {market.wti ? (
              <div className="rounded-xl border border-border bg-black/20 p-4">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  {market.wti.name}
                </p>
                <p className="mt-1 font-mono text-3xl text-amber-100">
                  {formatUsd(market.wti.price)}
                </p>
                <p
                  className={
                    market.wti.changePercent >= 0
                      ? "mt-1 text-sm text-emerald-300"
                      : "mt-1 text-sm text-red-300"
                  }
                >
                  {formatPercent(market.wti.changePercent)} on the barrel
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                WTI tape is dark. The stock basket is still live.
              </p>
            )}
            <p className="text-sm leading-relaxed text-muted-foreground">
              $GUSH = weighted oil majors ÷ {TOKEN.divisor}. When Exxon and
              Chevron move, the token moves with them.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-amber-400/10 bg-zinc-950/60">
          <CardHeader>
            <CardTitle>Oil-stock pair book</CardTitle>
            <CardDescription>
              Each major owns a fixed weight. The $GUSH slice is that weight
              times the share price, divided by {TOKEN.divisor}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PairTable rows={market.rows} />
          </CardContent>
        </Card>

        <Card className="border-amber-400/10 bg-zinc-950/60">
          <CardHeader>
            <CardTitle>Rig desk</CardTitle>
            <CardDescription>
              Paper swap at the live peg. No chain, no wallet, just the oil
              tape.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SwapDesk price={market.price} />
          </CardContent>
        </Card>
      </section>

      <Card className="border-amber-400/10 bg-zinc-950/60">
        <CardHeader>
          <CardTitle>Peg history</CardTitle>
          <CardDescription>
            Daily $GUSH rebuilt from Yahoo closes, with WTI on the right axis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GushChart history={market.history} />
        </CardContent>
      </Card>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-amber-400/10 bg-zinc-950/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="size-4 text-amber-300" />
              How the pair works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              $GUSH is not a stablecoin and not a claim on barrels. It is a
              meme index: six oil-major stocks, fixed weights, one divisor.
            </p>
            <p className="font-mono text-amber-100/90">
              GUSH = (0.24 XOM + 0.20 CVX + 0.16 COP + 0.16 SHEL + 0.12 BP +
              0.12 OXY) / {TOKEN.divisor}
            </p>
            <p>
              Daily change is the same weighted blend of each stock&apos;s
              percent move. WTI crude is shown as a weather report for the
              patch, not a seventh weight.
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-400/10 bg-zinc-950/60">
          <CardHeader>
            <CardTitle>Tokenomics</CardTitle>
            <CardDescription>
              One billion tokens. The float is a story; the peg is the product.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {TOKENOMICS.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-mono text-amber-100">{row.share}</span>
              </div>
            ))}
            <Separator />
            <p className="text-xs text-muted-foreground">
              Weights on the pair book:{" "}
              {market.rows
                .map((row) => `${row.symbol} ${formatWeight(row.weight)}`)
                .join(" · ")}
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-black/20 px-3 py-3">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 font-mono text-lg text-amber-50">{value}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-6">
      <div className="h-64 animate-pulse rounded-xl bg-muted/30" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-xl bg-muted/20" />
        <div className="h-80 animate-pulse rounded-xl bg-muted/20" />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Spudding the well and pulling the oil-stock tape…
      </p>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card className="border-destructive/40 bg-zinc-950/70">
      <CardHeader>
        <CardTitle>The tape went dark</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onRetry}>Try the field again</Button>
      </CardContent>
    </Card>
  );
}
