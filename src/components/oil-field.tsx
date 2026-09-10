"use client";

import { useCallback, useEffect, useState } from "react";
import { PAIR, TOKEN, type MarketSnapshot } from "@/lib/basket";
import {
  formatCompactUsd,
  formatPercent,
  formatTime,
  formatUsd,
} from "@/lib/format";
import { BarrelMark } from "@/components/logo";
import { PumpField } from "@/components/pump-field";

const OIL_CA = "0x00069420";
const PONS_TRADE = "https://ponsfamily.com";
const CHART = `https://dexscreener.com/robinhood/${OIL_CA}`;
const EXPLORER = `https://robinhoodchain.blockscout.com/address/${OIL_CA}`;
const TWITTER = "https://x.com/oilcoincash";

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const field = document.createElement("textarea");
    field.value = value;
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
}

const STEPS = [
  {
    kicker: "01",
    title: "BUY",
    body: "A buy pulls tokenized USO into the pool. The other side of the book is the barrel, not a dollar.",
  },
  {
    kicker: "02",
    title: "SELL",
    body: "A sell pushes USO back out. Same pool, same pair. The barrel moves, $OIL moves.",
  },
  {
    kicker: "03",
    title: "CUT",
    body: "Three percent on the way in, three percent on the way out. That cut buys USO.",
  },
];

export function OilField({
  initialMarket,
}: {
  initialMarket: MarketSnapshot;
}) {
  const [market, setMarket] = useState(initialMarket);

  const pair = market.rows[0];
  const up = market.changePercent >= 0;

  const poke = useCallback(async () => {
    try {
      const response = await fetch("/api/market", { cache: "no-store" });
      const payload = (await response.json()) as MarketSnapshot & {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "tape silent");
      }
      setMarket(payload);
    } catch {
      // keep last print on the page
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void poke();
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [poke]);

  const tape = [
    `${TOKEN.symbol} ${formatUsd(market.price, true)}`,
    `${formatPercent(market.changePercent)} today`,
    `${PAIR.symbol} ${pair ? formatUsd(pair.price) : "—"}`,
    `formula ${PAIR.symbol} / ${TOKEN.divisor}`,
    market.source === "live" ? "tape open" : "tape held",
    "3% buy · 3% sell · buys USO",
    "on Pons · Robinhood Chain",
  ];

  return (
    <div className="field-skin flex min-h-svh flex-col text-[#f0d7a0]">
      <div className="field-backdrop" aria-hidden>
        <PumpField />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col">
      <div className="hazard-bar h-2" />

      <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-[#f0b429]/15 bg-[#0c0a07]/82 px-4 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <BarrelMark className="size-9 shrink-0" />
          <div className="min-w-0">
            <p className="font-heading text-lg tracking-[0.22em] text-[#ffe08a]">
              OIL
            </p>
            <p className="font-mono text-[10px] tracking-[0.18em] text-[#f0b429]/65 uppercase">
              lease 69420
            </p>
          </div>
        </div>
        <ContractSlot />
        <div className="justify-self-end text-right">
          <div className="flex items-center justify-end gap-2">
            <span
              className={`size-2 rounded-full ${
                market.source === "live"
                  ? "bg-[#8fbe6a] lamp-live"
                  : "bg-[#f0b429]/40"
              }`}
            />
            <p className="font-heading text-sm tracking-wide text-[#ffe08a] sm:text-base">
              {formatUsd(market.price, true)}
            </p>
          </div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-[#f0b429]/70 uppercase">
            oilcoin.cash
          </p>
        </div>
      </header>

      <div className="overflow-hidden border-b border-[#f0b429]/20 bg-[#0c0a07]/90">
        <div className="animate-marquee flex w-max gap-10 py-2 font-mono text-[11px] tracking-[0.18em] text-[#f0b429] uppercase">
          {[...tape, ...tape].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <div className="lease-plate">
        <span>well {OIL_CA}</span>
        <span>Pons · Robinhood Chain</span>
        <span>3% buy · 3% sell · buys USO</span>
        <span>
          {PAIR.symbol} / {TOKEN.divisor}
        </span>
        <span>1B supply</span>
        <span className={market.source === "live" ? "text-[#8fbe6a]" : ""}>
          {market.source === "live" ? "tape open" : "tape held"}
        </span>
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-10 sm:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <div className="plat-frame flex flex-col justify-end">
            <span className="plat-corner-bl" aria-hidden />
            <span className="plat-corner-br" aria-hidden />
            <div className="flex flex-wrap gap-2">
              <span className="stamp-chip">launching</span>
              <span className="stamp-chip">USO peg</span>
              <span className="stamp-chip">on Pons</span>
              <span className="stamp-chip">one fund</span>
            </div>
            <p className="font-mono mt-5 text-[11px] tracking-[0.32em] text-[#f0b429] uppercase">
              one market · one barrel
            </p>
            <h1 className="oil-stamp font-heading mt-2 text-5xl leading-[0.86] tracking-tight text-[#ffe08a] sm:text-7xl">
              DRILL
              <br />
              BABY DRILL
            </h1>
            <p className="font-heading mt-3 text-lg tracking-wide text-[#f0b429] sm:text-xl">
              IF THE BARREL PUMPS, WE PUMP.
            </p>
            <p className="font-catalog mt-4 max-w-xl text-lg leading-relaxed text-[#f0d7a0]/75">
              Most tokens trade against a dollar. $OIL trades against a barrel
              — USO, as close to crude as this chain has. The peg is USO over{" "}
              {TOKEN.divisor}. On Pons, on Robinhood Chain.
            </p>
            <div className="formula-rail mt-6">
              <FormulaCell
                label={PAIR.symbol}
                value={pair ? formatUsd(pair.price) : "—"}
              />
              <span className="formula-op">/</span>
              <FormulaCell label="divisor" value={String(TOKEN.divisor)} />
              <span className="formula-op">=</span>
              <FormulaCell
                label={TOKEN.symbol}
                value={formatUsd(market.price, true)}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="stamp-chip">3% buy</span>
              <span className="stamp-chip">3% sell</span>
              <span className="stamp-chip">buys USO</span>
              <span className="stamp-chip">1B OIL</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={PONS_TRADE}
                target="_blank"
                rel="noreferrer"
                className="bg-[#f0b429] px-5 py-2.5 font-heading tracking-wide text-[#1a1208]"
              >
                TRADE ON PONS
              </a>
              <a
                href="#pair"
                className="border border-[#f0b429]/55 px-5 py-2.5 font-heading tracking-wide text-[#ffe08a]"
              >
                SEE THE PAIR
              </a>
            </div>
          </div>
          <FeaturedCard market={market} />
        </section>

        <section className="grid grid-cols-2 gap-px overflow-hidden border border-[#f0b429]/20 bg-[#f0b429]/20 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="peg" value={formatUsd(market.price, true)} />
          <Stat
            label="today"
            value={formatPercent(market.changePercent)}
            hot={up}
          />
          <Stat
            label={PAIR.symbol}
            value={pair ? formatUsd(pair.price) : "—"}
          />
          <Stat label="market cap" value={formatCompactUsd(market.marketCap)} />
          <Stat label="supply" value="1B OIL" />
          <Stat
            label="tape"
            value={market.source === "live" ? "open" : "held"}
            hot={market.source === "live"}
          />
        </section>

        <section id="pair" className="scroll-mt-8 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.28em] text-[#f0b429] uppercase">
                not a dollar pair
              </p>
              <h2 className="font-heading mt-1 text-3xl tracking-wide text-[#ffe08a]">
                Live pair
              </h2>
            </div>
            <p className="font-mono text-[11px] text-[#f0d7a0]/45">
              updated {formatTime(market.asOf)}
            </p>
          </div>
          <div className="border border-[#f0b429]/25 bg-[#0c0a07]/88 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-heading text-4xl tracking-wide text-[#ffe08a]">
                  {TOKEN.symbol}
                </p>
                <p className="mt-1 text-sm text-[#f0d7a0]/65">
                  one pool · {PAIR.name} · 3/3 buys USO
                </p>
              </div>
              <span
                className={`font-mono text-[11px] tracking-[0.2em] uppercase ${
                  up ? "text-[#8fbe6a]" : "text-[#ff6b4a]"
                }`}
              >
                {up ? "euphoria" : "copium"} ·{" "}
                {market.source === "live" ? "live" : "held"}
              </span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Row
                label="token"
                value={formatUsd(market.price, true)}
                sub={formatPercent(market.changePercent)}
              />
              <Row
                label="uso"
                value={pair ? formatUsd(pair.price) : "—"}
                sub={pair ? formatPercent(pair.changePercent) : "—"}
              />
              <Row
                label="formula"
                value={`${PAIR.symbol} / ${TOKEN.divisor}`}
                sub="one name. one peg."
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.28em] text-[#f0b429] uppercase">
              the book
            </p>
            <h2 className="font-heading mt-1 text-3xl tracking-wide text-[#ffe08a]">
              Two things in one pool.
            </h2>
            <p className="font-catalog mt-4 max-w-2xl text-lg leading-relaxed text-[#f0d7a0]/75">
              Most tokens trade against a dollar. $OIL trades against a barrel
              — or as close to one as exists on this chain. Every buy pulls
              tokenized USO into the pool. Every sell pushes it back out.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="border border-[#f0b429]/20 bg-[#0c0a07]/88 p-5">
              <p className="font-mono text-[11px] tracking-[0.24em] text-[#f0b429]">
                the coin
              </p>
              <h3 className="font-heading mt-2 text-2xl text-[#ffe08a]">
                {TOKEN.symbol}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#f0d7a0]/70">
                Fixed supply. One name. Pegged as {PAIR.symbol} over{" "}
                {TOKEN.divisor}. If the fund pumps, we pump.
              </p>
            </article>
            <article className="border border-[#f0b429]/20 bg-[#0c0a07]/88 p-5">
              <p className="font-mono text-[11px] tracking-[0.24em] text-[#f0b429]">
                the barrel
              </p>
              <h3 className="font-heading mt-2 text-2xl text-[#ffe08a]">
                {PAIR.symbol}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#f0d7a0]/70">
                {PAIR.name}. The other side of the book. Hold the $OIL, sit on
                the barrel.
              </p>
            </article>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <article
                key={step.kicker}
                className="border border-[#f0b429]/20 bg-[#0c0a07]/88 p-5"
              >
                <p className="font-mono text-[11px] tracking-[0.24em] text-[#f0b429]">
                  {step.kicker}
                </p>
                <h3 className="font-heading mt-2 text-2xl text-[#ffe08a]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#f0d7a0]/70">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="window" className="scroll-mt-8 space-y-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.28em] text-[#f0b429] uppercase">
              fair launched
            </p>
            <h2 className="font-heading mt-1 text-3xl tracking-wide text-[#ffe08a]">
              No team bag.
            </h2>
            <p className="font-catalog mt-4 max-w-2xl text-lg leading-relaxed text-[#f0d7a0]/75">
              No presale. No team allocation. No unlock schedule waiting to
              land on the chart. Three percent on buys, three percent on sells,
              and all of it buys USO.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="border border-[#f0b429]/20 bg-[#0c0a07]/88 p-5">
              <p className="font-heading text-2xl text-[#ffe08a]">3% on buys</p>
              <p className="mt-3 text-sm leading-relaxed text-[#f0d7a0]/70">
                Taken on the way in. That cut buys USO.
              </p>
            </article>
            <article className="border border-[#f0b429]/20 bg-[#0c0a07]/88 p-5">
              <p className="font-heading text-2xl text-[#ffe08a]">3% on sells</p>
              <p className="mt-3 text-sm leading-relaxed text-[#f0d7a0]/70">
                Taken on the way out. That cut buys USO either direction.
              </p>
            </article>
            <article className="border border-[#f0b429]/20 bg-[#0c0a07]/88 p-5">
              <p className="font-heading text-2xl text-[#ffe08a]">
                100% buys USO
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#f0d7a0]/70">
                Every cent of the cut buys USO. Nothing routes anywhere else.
              </p>
            </article>
          </div>
        </section>

        <section id="fillup" className="scroll-mt-8 space-y-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.28em] text-[#f0b429] uppercase">
              the well
            </p>
            <h2 className="font-heading mt-1 text-3xl tracking-wide text-[#ffe08a]">
              Fill up.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#f0d7a0]/70">
              The $OIL contract and where to trade.
            </p>
          </div>
          <div className="space-y-2">
            <AddressRow label={TOKEN.symbol} value={OIL_CA} />
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={PONS_TRADE}
              target="_blank"
              rel="noreferrer"
              className="bg-[#f0b429] px-5 py-2.5 font-heading tracking-wide text-[#1a1208]"
            >
              TRADE
            </a>
            <a
              href={CHART}
              target="_blank"
              rel="noreferrer"
              className="border border-[#f0b429]/55 px-5 py-2.5 font-heading tracking-wide text-[#ffe08a]"
            >
              CHART
            </a>
            <a
              href={TWITTER}
              target="_blank"
              rel="noreferrer"
              className="border border-[#f0b429]/55 px-5 py-2.5 font-heading tracking-wide text-[#ffe08a]"
            >
              X
            </a>
            <a
              href={EXPLORER}
              target="_blank"
              rel="noreferrer"
              className="border border-[#f0b429]/55 px-5 py-2.5 font-heading tracking-wide text-[#ffe08a]"
            >
              EXPLORER
            </a>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] tracking-[0.28em] text-[#f0b429] uppercase">
                tape
              </p>
              <h2 className="font-heading mt-1 text-3xl tracking-wide text-[#ffe08a]">
                Prints
              </h2>
            </div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-[#f0d7a0]/40 uppercase">
              on Pons · 1B · 3/3
            </p>
          </div>
          <ul className="divide-y divide-[#f0b429]/15 border border-[#f0b429]/20 bg-[#0c0a07]/88">
            <Print
              who={TOKEN.symbol}
              what={`peg ${formatUsd(market.price, true)}`}
              meta={formatPercent(market.changePercent)}
            />
            <Print
              who={PAIR.symbol}
              what={pair ? formatUsd(pair.price) : "—"}
              meta={pair ? formatPercent(pair.changePercent) : "—"}
            />
            <Print
              who="formula"
              what={`${PAIR.symbol} / ${TOKEN.divisor}`}
              meta="locked"
            />
            <Print who="fees" what="3% buy / 3% sell" meta="buys USO" />
          </ul>
        </section>

        <footer className="border-t border-[#f0b429]/15 pt-6 text-[11px] leading-relaxed text-[#f0d7a0]/40">
          oilcoin.cash · $OIL launches on Pons, on Robinhood Chain. One
          listing, paired to {PAIR.name}. 3% buy and 3% sell buy USO.
          Peg quotes from the public tape. Not advice.
        </footer>
      </main>
      </div>
    </div>
  );
}

function ContractSlot() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await copyText(OIL_CA);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="min-w-0 text-center">
      <p className="font-mono text-[10px] tracking-[0.22em] text-[#f0b429]/70 uppercase">
        contract
      </p>
      <div className="mt-0.5 flex items-center justify-center gap-2">
        <p className="font-mono text-[11px] break-all text-[#ffe08a] sm:text-sm">
          {OIL_CA}
        </p>
        <button
          type="button"
          onClick={() => void copy()}
          className="shrink-0 border border-[#f0b429]/40 px-2 py-0.5 font-mono text-[10px] tracking-[0.18em] text-[#f0b429] uppercase hover:border-[#f0b429] hover:text-[#ffe08a]"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
    </div>
  );
}

function FormulaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-[9px] tracking-[0.2em] text-[#f0d7a0]/45 uppercase">
        {label}
      </p>
      <p className="font-heading mt-0.5 truncate text-lg text-[#ffe08a] sm:text-xl">
        {value}
      </p>
    </div>
  );
}

function FeaturedCard({ market }: { market: MarketSnapshot }) {
  const pair = market.rows[0];
  const up = market.changePercent >= 0;
  return (
    <article className="relative flex flex-col justify-between overflow-hidden border border-[#f0b429]/35 bg-[#0c0a07]/90 p-5">
      <div className="hazard-bar absolute inset-x-0 top-0 h-1.5" />
      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-[#f0b429] uppercase">
            the listing
          </p>
          <p className="font-heading mt-3 text-5xl tracking-wide text-[#ffe08a]">
            {TOKEN.symbol}
          </p>
          <p className="mt-1 text-sm text-[#f0d7a0]/60">
            {PAIR.name} · Pons · 3/3 buys USO
          </p>
        </div>
        <p className="font-mono text-[10px] tracking-[0.16em] text-[#f0b429]/70 uppercase">
          {OIL_CA}
        </p>
      </div>
      <div className="mt-6 border border-[#f0b429]/20 bg-black/25 px-3 py-2 font-mono text-[11px] tracking-[0.12em] text-[#f0d7a0]/70 uppercase">
        {PAIR.symbol} {pair ? formatUsd(pair.price) : "—"} / {TOKEN.divisor} ={" "}
        <span className="text-[#c8f08a]">{formatUsd(market.price, true)}</span>
      </div>
      <div className="mt-6">
        <p className="phosphor font-heading text-5xl text-[#c8f08a] sm:text-6xl">
          {formatUsd(market.price, true)}
        </p>
        <p
          className={`mt-1 font-heading text-xl ${
            up ? "text-[#8fbe6a]" : "text-[#ff6b4a]"
          }`}
        >
          {formatPercent(market.changePercent)}
        </p>
        <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-[#f0d7a0]/40 uppercase">
          updated {formatTime(market.asOf)}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] tracking-[0.16em] uppercase">
        <span className="border border-[#f0b429]/30 px-2 py-1">
          3/3 · buys USO
        </span>
        <span className="border border-[#f0b429]/30 px-2 py-1">
          hold $OIL · get USO
        </span>
        <span
          className={`border px-2 py-1 ${
            market.source === "live"
              ? "border-[#8fbe6a]/40 text-[#8fbe6a]"
              : "border-[#f0b429]/30 text-[#f0d7a0]/60"
          }`}
        >
          {market.source === "live" ? "tape open" : "tape held"}
        </span>
      </div>
    </article>
  );
}

function Stat({
  label,
  value,
  hot,
}: {
  label: string;
  value: string;
  hot?: boolean;
}) {
  return (
    <div className="bg-[#0c0a07] px-3 py-3">
      <p className="font-mono text-[10px] tracking-[0.2em] text-[#f0d7a0]/40 uppercase">
        {label}
      </p>
      <p
        className={`mt-1 font-heading text-lg ${
          hot ? "text-[#8fbe6a]" : "text-[#ffe08a]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.2em] text-[#f0d7a0]/40 uppercase">
        {label}
      </p>
      <p className="mt-1 font-heading text-2xl text-[#ffe08a]">{value}</p>
      <p className="text-xs text-[#f0d7a0]/50">{sub}</p>
    </div>
  );
}

function AddressRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await copyText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border border-[#f0b429]/20 bg-[#0c0a07]/88 px-4 py-3">
      <p className="font-heading text-lg text-[#ffe08a]">{label}</p>
      <p className="font-mono min-w-0 flex-1 break-all text-sm text-[#f0d7a0]/80">
        {value}
      </p>
      <button
        type="button"
        onClick={() => void copy()}
        className="shrink-0 border border-[#f0b429]/40 px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-[#f0b429] uppercase hover:border-[#f0b429] hover:text-[#ffe08a]"
      >
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}

function Print({
  who,
  what,
  meta,
}: {
  who: string;
  what: string;
  meta: string;
}) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
      <span className="font-heading text-[#ffe08a]">{who}</span>
      <span className="font-mono text-sm text-[#c8f08a]">{what}</span>
      <span className="font-mono text-[11px] text-[#f0d7a0]/45">{meta}</span>
    </li>
  );
}
