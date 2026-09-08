"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PAIR, TOKEN, type MarketSnapshot } from "@/lib/basket";
import { formatPercent, formatUsd } from "@/lib/format";
import { FieldTicket } from "@/components/field-ticket";

export function OilField({
  initialMarket,
}: {
  initialMarket: MarketSnapshot;
}) {
  const [market, setMarket] = useState(initialMarket);
  const [refreshing, setRefreshing] = useState(false);

  const pair = market.rows[0];
  const up = market.changePercent >= 0;

  const poke = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/market", { cache: "no-store" });
      const payload = (await response.json()) as MarketSnapshot & {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "tape silent");
      }
      setMarket(payload);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void poke();
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [poke]);

  return (
    <div className="field-skin flex min-h-svh flex-col text-[#f0d7a0]">
      <div className="field-grain pointer-events-none absolute inset-0" />

      <div className="relative z-10 overflow-hidden border-b border-[#f0b429] bg-[#f0b429] text-[#1a1208]">
        <div className="animate-marquee flex w-max gap-16 py-1.5 font-heading text-sm tracking-[0.28em] uppercase">
          <Tape market={market} />
          <Tape market={market} />
        </div>
      </div>

      <header className="relative z-10 flex items-center justify-between px-4 py-3 font-mono text-[10px] tracking-[0.28em] uppercase sm:px-6">
        <span className="text-[#c4a36a]">{TOKEN.symbol} × {PAIR.symbol}</span>
        <nav className="flex gap-5 text-[#f0d7a0]/70">
          <span className="text-[#f0b429]">floor</span>
          <Link href="/term" className="hover:text-[#fff1c2]">
            shell
          </Link>
          <Link href="/desk" className="hover:text-[#fff1c2]">
            desk
          </Link>
          <button
            type="button"
            onClick={() => void poke()}
            disabled={refreshing}
            className="hover:text-[#fff1c2] disabled:opacity-50"
          >
            {refreshing ? "reading" : "refresh"}
          </button>
        </nav>
      </header>

      <main className="relative z-10 grid flex-1 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between border-[#f0b429]/20 px-5 py-6 sm:px-8 lg:border-r">
          <div>
            <p className="font-mono text-[11px] tracking-[0.4em] text-[#f0b429] uppercase">
              paired to exxon · nobody else
            </p>
            <h1 className="oil-stamp font-heading mt-3 text-[28vw] leading-[0.78] tracking-tight text-[#ffe08a] lg:text-[9.5rem]">
              OIL
            </h1>
            <p className="font-heading mt-4 max-w-md text-2xl tracking-wide text-[#fff1c2]">
              if daddy {PAIR.symbol} pumps, we pump.
            </p>
            <p className="font-catalog mt-3 max-w-md text-base text-[#f0d7a0]/70">
              One name on the tape. {TOKEN.symbol} is {PAIR.symbol} divided by{" "}
              {TOKEN.divisor}. That is the whitepaper.
            </p>
          </div>
          <p className="mt-10 font-mono text-[11px] tracking-[0.18em] text-[#f0d7a0]/35 uppercase">
            paper floor · not a barrel · not advice
          </p>
        </section>

        <section className="flex flex-col gap-6 bg-black/25 px-5 py-6 sm:px-8">
          <div className="grid grid-cols-2 gap-3">
            <Quote
              label={TOKEN.symbol}
              value={formatUsd(market.price, true)}
              change={formatPercent(market.changePercent)}
              up={up}
              huge
            />
            <Quote
              label={PAIR.symbol}
              value={pair ? formatUsd(pair.price) : "—"}
              change={pair ? formatPercent(pair.changePercent) : "—"}
              up={pair ? pair.changePercent >= 0 : false}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-[0.22em] uppercase">
            <span
              className={
                market.source === "live" ? "text-[#8fbe6a]" : "text-[#d07050]"
              }
            >
              {market.source === "live" ? "● live tape" : "● held tape"}
            </span>
            <span className="text-[#f0d7a0]/40">
              {PAIR.symbol} / {TOKEN.divisor}
            </span>
          </div>
          <div className="border border-[#f0b429]/25 bg-[#120e08]/80 p-5">
            <FieldTicket price={market.price} />
          </div>
        </section>
      </main>
    </div>
  );
}

function Tape({ market }: { market: MarketSnapshot }) {
  const pair = market.rows[0];
  const text = [
    TOKEN.symbol,
    formatUsd(market.price, true),
    formatPercent(market.changePercent),
    PAIR.symbol,
    pair ? formatUsd(pair.price) : "",
    "if exxon pumps we pump",
    "one stock one token",
    "drill baby drill",
  ]
    .filter(Boolean)
    .join("   ·   ");
  return <span>{text}</span>;
}

function Quote({
  label,
  value,
  change,
  up,
  huge,
}: {
  label: string;
  value: string;
  change: string;
  up: boolean;
  huge?: boolean;
}) {
  return (
    <div className="border border-[#f0b429]/20 bg-[#0c0a07] p-4">
      <p className="font-mono text-[10px] tracking-[0.28em] text-[#c4a36a] uppercase">
        {label}
      </p>
      <p
        className={`phosphor mt-2 font-heading tracking-wide text-[#c8f08a] ${
          huge ? "text-4xl sm:text-5xl" : "text-3xl"
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-1 font-mono text-sm ${
          up ? "text-[#8fbe6a]" : "text-[#d07050]"
        }`}
      >
        {change}
      </p>
    </div>
  );
}
