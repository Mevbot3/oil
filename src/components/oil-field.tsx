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

const STEPS = [
  {
    kicker: "01",
    title: "DRILL",
    body: "On Pons, on Robinhood Chain. A 5% fee on every buy and every sell goes to the treasury.",
  },
  {
    kicker: "02",
    title: "PAIR",
    body: `$OIL is USO over ${TOKEN.divisor}. Same move as the oil fund, smaller sticker. If the barrel pumps, we pump.`,
  },
  {
    kicker: "03",
    title: "TREASURY",
    body: "Five in. Five out. That cut does not bounce to holders. It sits in the treasury on Pons.",
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
    "5% buy · 5% sell · treasury",
    "on Pons · Robinhood Chain",
  ];

  return (
    <div className="field-skin flex min-h-svh flex-col text-[#f0d7a0]">
      <div className="field-grain pointer-events-none absolute inset-0 z-0" />
      <div className="field-watermark pointer-events-none" aria-hidden>
        OIL OIL OIL OIL
      </div>
      <div className="oil-drip left-[8%]" />
      <div className="oil-drip oil-drip-2" />
      <div className="oil-drip oil-drip-3" />
      <div className="oil-blob left-[10%] top-[12%] size-64 bg-[#f0b429]/12" />
      <div className="oil-blob right-[6%] top-[40%] size-72 bg-[#3cb87a]/8" />

      <div className="hazard-bar relative z-10 h-2" />

      <header className="relative z-10 flex items-center px-4 py-4 sm:px-8">
        <div className="flex items-center gap-2">
          <BarrelMark className="size-9" />
          <span className="font-heading text-lg tracking-[0.22em] text-[#ffe08a]">
            OIL
          </span>
        </div>
      </header>

      <div className="relative z-10 overflow-hidden border-y border-[#f0b429]/20 bg-black/40">
        <div className="animate-marquee flex w-max gap-10 py-2 font-mono text-[11px] tracking-[0.18em] text-[#f0b429] uppercase">
          {[...tape, ...tape].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-10 sm:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <div className="flex flex-col justify-end">
            <p className="font-mono text-[11px] tracking-[0.32em] text-[#f0b429] uppercase">
              one market · one fund
            </p>
            <h1 className="font-heading mt-3 text-5xl leading-[0.9] tracking-tight text-[#ffe08a] sm:text-7xl">
              A meme paired to USO.
            </h1>
            <p className="font-catalog mt-5 max-w-xl text-lg leading-relaxed text-[#f0d7a0]/75">
              $OIL is paired to oil. The peg is USO over {TOKEN.divisor}. It
              lives on Pons, on Robinhood Chain. Five percent on every buy and
              every sell goes to the treasury.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#pair"
                className="bg-[#f0b429] px-5 py-2.5 font-heading tracking-wide text-[#1a1208]"
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
          <Stat label="paper cap" value={formatCompactUsd(market.marketCap)} />
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
                the only listing
              </p>
              <h2 className="font-heading mt-1 text-3xl tracking-wide text-[#ffe08a]">
                Live pair
              </h2>
            </div>
            <p className="font-mono text-[11px] text-[#f0d7a0]/45">
              updated {formatTime(market.asOf)}
            </p>
          </div>
          <div className="border border-[#f0b429]/25 bg-black/35 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-heading text-4xl tracking-wide text-[#ffe08a]">
                  {TOKEN.symbol}
                </p>
                <p className="mt-1 text-sm text-[#f0d7a0]/65">
                  paired with {PAIR.name} · on Pons · 5/5 to treasury
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
              how the coin pays
            </p>
            <h2 className="font-heading mt-1 text-3xl tracking-wide text-[#ffe08a]">
              Drill. Pair. Treasury.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <article
                key={step.kicker}
                className="border border-[#f0b429]/20 bg-black/30 p-5"
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
              the cut
            </p>
            <h2 className="font-heading mt-1 text-3xl tracking-wide text-[#ffe08a]">
              Fees
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#f0d7a0]/70">
              On Pons. On Robinhood Chain. Five percent on the way in, five
              percent on the way out. That cut goes to the treasury.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Mini label="buy tax" value="5%" />
            <Mini label="sell tax" value="5%" />
            <Mini label="to treasury" value="5/5" />
            <Mini label="chain" value="Pons" />
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
              all 1 · new 0 · migrated 0
            </p>
          </div>
          <ul className="divide-y divide-[#f0b429]/15 border border-[#f0b429]/20 bg-black/30">
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
            <Print who="fees" what="5% buy / 5% sell" meta="treasury" />
          </ul>
        </section>

        <footer className="border-t border-[#f0b429]/15 pt-6 text-[11px] leading-relaxed text-[#f0d7a0]/40">
          Experimental paper market. One listing, paired to {PAIR.name}. On
          Pons, on Robinhood Chain. 5% buy and 5% sell to the treasury. Quotes
          from the public tape. Not a security, not advice.
        </footer>
      </main>
    </div>
  );
}

function FeaturedCard({ market }: { market: MarketSnapshot }) {
  const pair = market.rows[0];
  const up = market.changePercent >= 0;
  return (
    <article className="relative flex flex-col justify-between overflow-hidden border border-[#f0b429]/35 bg-black/45 p-5">
      <div className="hazard-bar absolute inset-x-0 top-0 h-1.5" />
      <div>
        <p className="font-mono text-[10px] tracking-[0.28em] text-[#f0b429] uppercase">
          well permit
        </p>
        <p className="font-heading mt-3 text-5xl tracking-wide text-[#ffe08a]">
          {TOKEN.symbol}
        </p>
        <p className="mt-1 text-sm text-[#f0d7a0]/60">
          {PAIR.name} · Pons · 5/5 treasury
        </p>
      </div>
      <div className="mt-8">
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
      </div>
      <div className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] tracking-[0.16em] uppercase">
        <span className="border border-[#f0b429]/30 px-2 py-1">
          5/5 · treasury
        </span>
        <span className="border border-[#f0b429]/30 px-2 py-1">
          {pair ? formatUsd(pair.price) : "—"}
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

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#f0b429]/20 bg-black/30 px-2 py-2">
      <p className="font-mono text-[10px] tracking-widest text-[#f0b429]/70 uppercase">
        {label}
      </p>
      <p className="font-heading text-lg text-[#ffe08a]">{value}</p>
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
