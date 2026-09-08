"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarrelMark } from "@/components/logo";
import { PairTable } from "@/components/pair-table";
import { SwapDesk } from "@/components/swap-desk";
import { TOKEN, type MarketSnapshot } from "@/lib/basket";
import { formatPercent, formatUsd } from "@/lib/format";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; market: MarketSnapshot };

const MARQUEE = [
  "OIL",
  "paired to XOM",
  "paired to Exxon",
  "if daddy pumps we pump",
  "drill baby drill",
  "touch oil",
  "one stock one token",
  "this is the ticker",
];

const OILNOMICS = [
  { label: "LP so we don't eat sand", share: "40%" },
  { label: "airdrop for oilmaxxis", share: "25%" },
  { label: "strategic petroleum group chat", share: "20%" },
  { label: "devs (locked, we have jobs)", share: "15%" },
];

const SHOUTS = [
  "anon just drilled 4,200 OIL and now talks like a wildcatter",
  "xom sneezed. $OIL caught a cold. that's the pair baby",
  "exxon up? we up. exxon down? we journal about it",
  "this is the most serious meme ever. it is literally called oil",
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
  const [shout, setShout] = useState(0);

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
        throw new Error(payload.error ?? "the tape died");
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
              : "could not reach the oil daddies.",
        };
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const tape = window.setInterval(() => {
      void load(true);
    }, 60_000);
    const chat = window.setInterval(() => {
      setShout((index) => (index + 1) % SHOUTS.length);
    }, 4500);
    return () => {
      window.clearInterval(tape);
      window.clearInterval(chat);
    };
  }, [load]);

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,_rgba(232,184,74,0.22),_transparent_36%),radial-gradient(circle_at_90%_10%,_rgba(120,40,8,0.35),_transparent_32%)]" />
      <Marquee />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header
          market={state.status === "ready" ? state.market : null}
          refreshing={refreshing}
          onRefresh={() => void load(true)}
        />

        {state.status === "loading" ? <LoadingState /> : null}
        {state.status === "error" ? (
          <ErrorState message={state.message} onRetry={() => void load(false)} />
        ) : null}
        {state.status === "ready" ? (
          <ReadyState market={state.market} shout={SHOUTS[shout]} />
        ) : null}

        <footer className="space-y-2 pb-20 text-xs leading-relaxed text-muted-foreground sm:pb-8">
          <p>
            $OIL is a demo meme coin. the price is a paper peg against a
            weighted basket of oil-major stocks, not a live on-chain market.
            quotes come from yahoo finance when the tape is up. this is not
            financial advice. it is oil.
          </p>
        </footer>
      </div>
      {state.status === "ready" ? (
        <a
          href="#ape"
          className="fixed right-4 bottom-4 z-20 rounded-full bg-amber-400 px-5 py-3 font-heading text-lg tracking-widest text-zinc-950 shadow-[0_0_24px_rgba(232,184,74,0.45)] sm:hidden"
        >
          APE OIL
        </a>
      ) : null}
    </div>
  );
}

function Marquee() {
  const text = MARQUEE.join("  ·  ");
  return (
    <div className="relative overflow-hidden border-b border-amber-400/30 bg-amber-400 text-zinc-950">
      <div className="animate-marquee flex w-max gap-16 py-1.5 font-heading text-sm tracking-[0.22em] uppercase">
        <span>{text}</span>
        <span>{text}</span>
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
        <BarrelMark className="size-14 shrink-0" />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-heading text-4xl tracking-widest text-amber-200">
              OIL
            </p>
            <Badge className="rotate-[-6deg] bg-amber-400 text-zinc-950">
              {TOKEN.symbol}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{TOKEN.tagline}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {market ? (
          <p className="font-heading text-lg tracking-wide text-amber-100">
            {TOKEN.symbol} {formatUsd(market.price, true)}
          </p>
        ) : null}
        <Link
          href="/"
          className="font-heading text-sm tracking-wide text-amber-200/80 underline-offset-4 hover:underline"
        >
          /field
        </Link>
        <Link
          href="/term"
          className="font-heading text-sm tracking-wide text-amber-200/80 underline-offset-4 hover:underline"
        >
          /term
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={refreshing ? "animate-spin" : ""} />
          poke the tape
        </Button>
      </div>
    </header>
  );
}

function ReadyState({
  market,
  shout,
}: {
  market: MarketSnapshot;
  shout: string;
}) {
  const up = market.changePercent >= 0;

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-zinc-950/70 px-5 py-8 sm:px-8">
        <Sticker className="-top-2 right-6 rotate-12" text="OILMAXXING" />
        <Sticker className="top-16 right-2 -rotate-6 hidden sm:block" text="BASED CRUDE" />
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-amber-400 text-zinc-950">
              paired to oil stocks
            </Badge>
            <Badge
              variant="outline"
              className={
                market.source === "live"
                  ? "border-emerald-500/40 text-emerald-300"
                  : "border-amber-500/40 text-amber-200"
              }
            >
              {market.source === "live" ? "LIVE TAPE" : "CACHED SLUDGE"}
            </Badge>
            <Badge variant="outline" className="border-amber-400/40 text-amber-100">
              {up ? "EUPHORIA" : "COPIUM"}
            </Badge>
          </div>
          <h1 className="font-heading text-[22vw] leading-[0.8] tracking-tight text-amber-300 drop-shadow-[0_8px_0_#5a3d0a] sm:text-[9rem]">
            OIL
          </h1>
          <p
            className={`inline-flex items-center gap-2 font-heading text-3xl tracking-wide ${
              up ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {formatUsd(market.price, true)}
            {up ? (
              <TrendingUp className="size-6" />
            ) : (
              <TrendingDown className="size-6" />
            )}
            {formatPercent(market.changePercent)}
          </p>
          <p className="max-w-xl text-lg text-amber-50/80">
            the meme coin named oil. paired to Exxon. if daddy pumps,
            $OIL pumps. if daddy dumps, we post through it.
          </p>
          <Button
            className="h-11 font-heading text-lg tracking-widest"
            onClick={() => {
              document.getElementById("ape")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            APE $OIL
          </Button>
        </div>
        <p className="mt-6 border-t border-amber-400/20 pt-4 font-heading text-sm tracking-wide text-amber-100/80">
          {shout}
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-amber-400/20 bg-zinc-950/70">
          <CardHeader>
            <CardTitle className="font-heading text-2xl tracking-wide">
              the pair
            </CardTitle>
            <CardDescription>
              $OIL is Exxon divided by {TOKEN.divisor}. that is the whole bit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PairTable rows={market.rows} />
          </CardContent>
        </Card>

        <Card id="ape" className="border-amber-400/20 bg-zinc-950/70">
          <CardHeader>
            <CardTitle className="font-heading text-2xl tracking-wide">
              ape machine
            </CardTitle>
            <CardDescription>
              paper swap at the live peg. no wallet. no chain. just vibes and
              Exxon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SwapDesk price={market.price} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-amber-400/20 bg-zinc-950/70">
          <CardHeader>
            <CardTitle className="font-heading text-2xl tracking-wide">
              the whole whitepaper
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              $OIL is not a claim on barrels. it is Exxon, divided.
            </p>
            <p className="font-mono text-amber-100">
              OIL = XOM / {TOKEN.divisor}
            </p>
            <p>
              if daddy pumps, we pump. if daddy dumps, we post through it.
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-400/20 bg-zinc-950/70">
          <CardHeader>
            <CardTitle className="font-heading text-2xl tracking-wide">
              oilnomics
            </CardTitle>
            <CardDescription>
              one billion $OIL. the float is a story. the peg is the product.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {OILNOMICS.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-heading text-lg text-amber-100">
                  {row.share}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}

function Sticker({ className, text }: { className?: string; text: string }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-md border-2 border-zinc-950 bg-amber-300 px-2 py-1 font-heading text-xs tracking-widest text-zinc-950 shadow-[3px_3px_0_#111] ${className ?? ""}`}
    >
      {text}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-6">
      <div className="h-64 animate-pulse rounded-3xl bg-muted/30" />
      <p className="text-center font-heading tracking-widest text-muted-foreground">
        SPUDDING THE MEME…
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
        <CardTitle className="font-heading text-2xl">tape went dark</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onRetry}>kick the rig</Button>
      </CardContent>
    </Card>
  );
}
