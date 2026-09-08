"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PAIR, TOKEN, type MarketSnapshot } from "@/lib/basket";
import { formatPercent, formatUsd } from "@/lib/format";
import { FieldTicket } from "@/components/field-ticket";
import { BarrelMark } from "@/components/logo";

const SHOUTS = [
  "xom sneezed. $OIL caught a cold.",
  "this is the most serious meme ever. it is called oil.",
  "if daddy pumps we pump. that's not a bit. that's the pair.",
  "wen refinery. wen dividend. wen barrel in the group chat.",
  "you cannot fade Exxon. you can only become oil.",
];

export function OilField({
  initialMarket,
}: {
  initialMarket: MarketSnapshot;
}) {
  const [market, setMarket] = useState(initialMarket);
  const [refreshing, setRefreshing] = useState(false);
  const [shout, setShout] = useState(0);

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
    const tape = window.setInterval(() => {
      void poke();
    }, 60_000);
    const chat = window.setInterval(() => {
      setShout((index) => (index + 1) % SHOUTS.length);
    }, 3800);
    return () => {
      window.clearInterval(tape);
      window.clearInterval(chat);
    };
  }, [poke]);

  return (
    <div className="field-skin flex min-h-svh flex-col text-[#f0d7a0]">
      <div className="field-grain pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 overflow-hidden bg-[#f0b429] text-[#1a1208]">
        <div className="animate-marquee flex w-max gap-16 py-2 font-heading text-base tracking-[0.22em] uppercase">
          <Tape market={market} />
          <Tape market={market} />
        </div>
      </div>

      <header className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <BarrelMark className="size-10" />
          <span className="font-heading text-xl tracking-[0.2em] text-[#ffe08a]">
            {TOKEN.symbol}
          </span>
        </div>
        <nav className="flex items-center gap-4 font-heading text-sm tracking-wide text-[#f0d7a0]/80">
          <span className="text-[#f0b429]">FLOOR</span>
          <Link href="/term" className="hover:text-[#fff1c2]">
            SHELL
          </Link>
          <Link href="/desk" className="hover:text-[#fff1c2]">
            DESK
          </Link>
          <button
            type="button"
            onClick={() => void poke()}
            disabled={refreshing}
            className="hover:text-[#fff1c2] disabled:opacity-50"
          >
            {refreshing ? "POKING…" : "POKE"}
          </button>
        </nav>
      </header>

      <main className="relative z-10 grid flex-1 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden px-5 py-6 sm:px-8 lg:border-r lg:border-[#f0b429]/25">
          <Sticker className="top-4 right-6 rotate-12" text="OILMAXXING" />
          <Sticker className="top-28 right-3 -rotate-6 hidden sm:block" text="BASED CRUDE" />
          <p className="font-heading text-sm tracking-[0.35em] text-[#f0b429]">
            PAIRED TO EXXON · NOBODY ELSE
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rotate-[-3deg] bg-[#f0b429] px-2 py-0.5 font-heading text-sm tracking-wide text-[#1a1208]">
              {up ? "EUPHORIA" : "COPIUM"}
            </span>
            <span className="rotate-[4deg] border border-[#f0b429] px-2 py-0.5 font-heading text-sm tracking-wide text-[#f0b429]">
              {market.source === "live" ? "LIVE TAPE" : "CACHED SLUDGE"}
            </span>
          </div>
          <h1 className="oil-stamp font-heading mt-2 text-[32vw] leading-[0.75] tracking-tight text-[#ffe08a] lg:text-[10rem]">
            OIL
          </h1>
          <p className="font-heading mt-4 max-w-lg text-3xl leading-none tracking-wide text-[#fff1c2] sm:text-4xl">
            IF DADDY {PAIR.symbol} PUMPS, WE PUMP.
          </p>
          <p className="mt-4 max-w-md text-lg text-[#f0d7a0]/80">
            {TOKEN.symbol} is {PAIR.symbol} divided by {TOKEN.divisor}. that is
            not a bit. that is the whole whitepaper.
          </p>
          <p className="font-heading mt-8 text-sm tracking-wide text-[#f0b429]">
            {SHOUTS[shout]}
          </p>
        </section>

        <section className="flex flex-col gap-5 bg-black/30 px-5 py-6 sm:px-8">
          <div className="grid grid-cols-2 gap-3">
            <Quote
              label={TOKEN.symbol}
              value={formatUsd(market.price, true)}
              change={formatPercent(market.changePercent)}
              up={up}
              huge
            />
            <Quote
              label={`DADDY ${PAIR.symbol}`}
              value={pair ? formatUsd(pair.price) : "—"}
              change={pair ? formatPercent(pair.changePercent) : "—"}
              up={pair ? pair.changePercent >= 0 : false}
            />
          </div>
          <p className="font-heading text-sm tracking-wide text-[#f0b429]/80">
            {PAIR.symbol} / {TOKEN.divisor} · 0% tax · paper oil only
          </p>
          <div className="border-2 border-[#f0b429] bg-[#120e08] p-5 shadow-[6px_6px_0_#f0b429]">
            <FieldTicket price={market.price} />
          </div>
          <p className="font-heading text-xs tracking-wide text-[#f0d7a0]/40">
            not a barrel. not advice. you are oil now.
          </p>
        </section>
      </main>
    </div>
  );
}

function Tape({ market }: { market: MarketSnapshot }) {
  const pair = market.rows[0];
  const text = [
    "OIL",
    formatUsd(market.price, true),
    formatPercent(market.changePercent),
    "DADDY XOM",
    pair ? formatUsd(pair.price) : "",
    "IF EXXON PUMPS WE PUMP",
    "OILMAXXING",
    "DRILL BABY DRILL",
    "WEN REFINERY",
    "TOUCH OIL",
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
    <div className="border-2 border-[#f0b429]/40 bg-[#0c0a07] p-4">
      <p className="font-heading text-sm tracking-wide text-[#f0b429]">{label}</p>
      <p
        className={`phosphor mt-1 font-heading tracking-wide text-[#c8f08a] ${
          huge ? "text-4xl sm:text-5xl" : "text-3xl"
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-1 font-heading text-lg ${
          up ? "text-[#8fbe6a]" : "text-[#ff6b4a]"
        }`}
      >
        {change}
      </p>
    </div>
  );
}

function Sticker({ className, text }: { className?: string; text: string }) {
  return (
    <div
      className={`pointer-events-none absolute border-2 border-[#1a1208] bg-[#f0b429] px-2 py-1 font-heading text-xs tracking-widest text-[#1a1208] shadow-[3px_3px_0_#1a1208] ${className ?? ""}`}
    >
      {text}
    </div>
  );
}
