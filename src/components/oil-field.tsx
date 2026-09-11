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
import {
  BuyMark,
  CutMark,
  FundMark,
  PoolDiagram,
  SellMark,
} from "@/components/marks";
import { PumpField } from "@/components/pump-field";

const OIL_CA = "0x00069420";
// The tokenized USO on the other side of the pair. Reads back as symbol USO,
// "United States Oil Fund • Robinhood Token", on Robinhood Chain (4663).
const USO_CA = "0xa30FA36Db767ad9eD3f7a60fC79526fB4d56D344";
const PONS_TRADE = "https://ponsfamily.com";
const CHART = `https://dexscreener.com/robinhood/${OIL_CA}`;
const EXPLORER = explorerFor(OIL_CA);
const TWITTER = "https://x.com/OILCOINonRH";
const USO_QUOTE = `https://robinhood.com/us/en/stocks/${PAIR.symbol}/`;

function explorerFor(address: string) {
  return `https://robinhoodchain.blockscout.com/address/${address}`;
}

const VENUE_LABEL: Record<MarketSnapshot["venue"], string> = {
  robinhood: "USO from Robinhood",
  yahoo: "USO from Yahoo Finance",
  none: "last known USO",
};

const CONTRACTS = [
  { label: TOKEN.symbol, note: "the coin", value: OIL_CA },
  { label: PAIR.symbol, note: "the barrel it trades against", value: USO_CA },
];

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
    body: "A buy pulls tokenized USO into the pool. The other side is the barrel, not a dollar.",
    Mark: BuyMark,
  },
  {
    kicker: "02",
    title: "SELL",
    body: "A sell pushes USO back out. Same pool, same pair. The barrel moves, $OIL moves.",
    Mark: SellMark,
  },
  {
    kicker: "03",
    title: "CUT",
    body: "Three percent on the way in, three percent on the way out. That cut buys USO.",
    Mark: CutMark,
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
        throw new Error(payload.error ?? "no quote");
      }
      setMarket(payload);
    } catch {
      // keep the last good price on the page
    }
  }, []);

  // The server reads the barrel every five minutes, so asking more often than
  // that just returns the same cached number.
  useEffect(() => {
    const timer = window.setInterval(() => {
      void poke();
    }, 5 * 60_000);
    return () => window.clearInterval(timer);
  }, [poke]);

  const ticker = [
    `${TOKEN.symbol} ${formatUsd(market.price, true)}`,
    `${formatPercent(market.changePercent)} today`,
    `${PAIR.symbol} ${pair ? formatUsd(pair.price) : "—"}`,
    `paired to ${PAIR.symbol}`,
    market.source === "live" ? "price live" : "last known price",
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

      <header className="border-b border-[#f0b429]/15 bg-[#0c0a07]/82">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 pt-4 pb-2 sm:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <BarrelMark className="size-9 shrink-0" />
            <div className="min-w-0">
              <p className="font-heading text-lg tracking-[0.22em] text-[#ffe08a]">
                OIL
              </p>
              <p className="font-mono text-[10px] tracking-[0.18em] text-[#f0b429]/65 uppercase">
                on Pons
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
          </div>
        </div>
        <DeskLinks />
      </header>

      <div className="overflow-hidden border-b border-[#f0b429]/20 bg-[#0c0a07]/90">
        <div className="animate-marquee flex w-max gap-10 py-2 font-mono text-[11px] tracking-[0.18em] text-[#f0b429] uppercase">
          {[...ticker, ...ticker].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <div className="lease-plate">
        <span>well {OIL_CA}</span>
        <span>Pons · Robinhood Chain</span>
        <span>3% buy · 3% sell · buys USO</span>
        <span>paired to {PAIR.symbol}</span>
        <span>1B supply</span>
        <span className={market.source === "live" ? "text-[#8fbe6a]" : ""}>
          {market.source === "live" ? "price live" : "last known price"}
        </span>
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-10 sm:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <div className="plat-frame flex flex-col justify-end">
            <span className="plat-corner-bl" aria-hidden />
            <span className="plat-corner-br" aria-hidden />
            <h1 className="oil-stamp font-heading text-5xl leading-[0.86] tracking-tight text-[#ffe08a] sm:text-7xl">
              DRILL
              <br />
              BABY DRILL
            </h1>
            <p className="font-heading mt-3 text-lg tracking-wide text-[#f0b429] sm:text-xl">
              IF THE BARREL PUMPS, WE PUMP.
            </p>
            <p className="font-catalog mt-4 max-w-xl text-xl leading-relaxed text-[#f0d7a0]/80">
              Most tokens trade against a dollar. $OIL trades against a barrel
              — USO.
            </p>
            <div className="formula-rail mt-6">
              <FormulaCell
                label={PAIR.symbol}
                value={pair ? formatUsd(pair.price) : "—"}
              />
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
            label="price feed"
            value={market.source === "live" ? "live" : "held"}
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
              {VENUE_LABEL[market.venue]} · updated {formatTime(market.asOf)}
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
                label="pair"
                value={PAIR.symbol}
                sub="one pool. one barrel."
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
              Every buy pulls tokenized USO into the pool. Every sell pushes it
              back out. Same pool, same pair, both directions.
            </p>
            <p className="font-catalog mt-3 max-w-2xl text-lg leading-relaxed text-[#f0d7a0]/75">
              Three percent on the way in, three percent on the way out. That
              cut buys USO, whichever way the trade went.
            </p>
          </div>

          <div className="flex justify-center border border-[#f0b429]/20 bg-[#0c0a07]/88 px-4 py-8">
            <PoolDiagram
              className="w-full max-w-xl"
              left={TOKEN.symbol}
              right={PAIR.symbol}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="flex gap-4 border border-[#f0b429]/20 bg-[#0c0a07]/88 p-5">
              <BarrelMark className="mt-1 size-11 shrink-0" />
              <div>
                <p className="font-mono text-[11px] tracking-[0.24em] text-[#f0b429]">
                  the coin
                </p>
                <h3 className="font-heading mt-2 text-2xl text-[#ffe08a]">
                  {TOKEN.symbol}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#f0d7a0]/70">
                  Fixed supply. One name. If the fund pumps, we pump.
                </p>
              </div>
            </article>
            <article className="flex gap-4 border border-[#f0b429]/20 bg-[#0c0a07]/88 p-5">
              <FundMark className="mt-1 size-11 shrink-0" />
              <div>
                <p className="font-mono text-[11px] tracking-[0.24em] text-[#f0b429]">
                  the barrel
                </p>
                <h3 className="font-heading mt-2 text-2xl text-[#ffe08a]">
                  {PAIR.symbol}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#f0d7a0]/70">
                  {PAIR.name}. The other side of the pool. Hold the $OIL, sit
                  on the barrel.
                </p>
              </div>
            </article>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <article
                key={step.kicker}
                className="border border-[#f0b429]/20 bg-[#0c0a07]/88 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[11px] tracking-[0.24em] text-[#f0b429]">
                    {step.kicker}
                  </p>
                  <step.Mark className="size-9" />
                </div>
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
              Both sides of the pair. $OIL, and the tokenized USO it trades
              against.
            </p>
          </div>
          <div className="space-y-2">
            {CONTRACTS.map((contract) => (
              <AddressRow
                key={contract.label}
                label={contract.label}
                note={contract.note}
                value={contract.value}
              />
            ))}
          </div>
        </section>

        <footer className="border-t border-[#f0b429]/15 pt-6 text-[11px] leading-relaxed text-[#f0d7a0]/40">
          $OIL launches on Pons, on Robinhood Chain. One listing, paired to{" "}
          {PAIR.name}. USO quotes come from the public{" "}
          <a
            href={USO_QUOTE}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-[#f0b429]"
          >
            Robinhood USO page
          </a>
          , read every five minutes. Not advice.
        </footer>
      </main>
      </div>
    </div>
  );
}

function DeskLinks() {
  const links = [
    { href: PONS_TRADE, label: "TRADE", gold: true },
    { href: CHART, label: "CHART" },
    { href: TWITTER, label: "X" },
    { href: EXPLORER, label: "EXPLORER" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-4 pb-3 sm:px-8">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className={
            link.gold
              ? "bg-[#f0b429] px-3 py-1.5 font-heading text-sm tracking-wide text-[#1a1208]"
              : "border border-[#f0b429]/55 px-3 py-1.5 font-heading text-sm tracking-wide text-[#ffe08a]"
          }
        >
          {link.label}
        </a>
      ))}
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
        {PAIR.symbol} {pair ? formatUsd(pair.price) : "—"}
        <span className="text-[#f0d7a0]/35"> · </span>
        <span className="text-[#c8f08a]">
          {TOKEN.symbol} {formatUsd(market.price, true)}
        </span>
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
          {market.source === "live" ? "price live" : "last known price"}
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

function AddressRow({
  label,
  note,
  value,
}: {
  label: string;
  note: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await copyText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border border-[#f0b429]/20 bg-[#0c0a07]/88 px-4 py-3">
      <div className="min-w-0">
        <p className="font-heading text-lg text-[#ffe08a]">{label}</p>
        <p className="font-mono text-[10px] tracking-[0.16em] text-[#f0d7a0]/40 uppercase">
          {note}
        </p>
      </div>
      <a
        href={explorerFor(value)}
        target="_blank"
        rel="noreferrer"
        className="font-mono min-w-0 flex-1 break-all text-sm text-[#f0d7a0]/80 underline decoration-[#f0b429]/35 underline-offset-4 hover:text-[#ffe08a] hover:decoration-[#f0b429]"
      >
        {value}
      </a>
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

