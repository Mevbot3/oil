"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { BasketRow, MarketSnapshot } from "@/lib/basket";
import { TOKEN } from "@/lib/basket";
import { formatPercent, formatUsd, formatWeight } from "@/lib/format";
import { FieldTicket } from "@/components/field-ticket";

const UNIT_NOTES: Record<string, string> = {
  XOM: "Baytown readout. Heaviest weight on the peg.",
  CVX: "Richmond plate. Second pump in the blend.",
  COP: "Midland unit. Gas-and-crude hybrid.",
  SHEL: "North Sea feed. London hours leak in.",
  BP: "Aberdeen lamp. Smallest of the majors, still counts.",
  OXY: "Permian gremlin. Last weight, first to jump.",
};

export function OilField({
  initialMarket,
}: {
  initialMarket: MarketSnapshot;
}) {
  const [market, setMarket] = useState(initialMarket);
  const [refreshing, setRefreshing] = useState(false);

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

  const up = market.changePercent >= 0;

  return (
    <div className="field-skin min-h-full text-[#d7c39a]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-14 px-4 py-8 sm:px-6 lg:py-12">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d7c39a]/20 pb-5">
          <div>
            <p className="font-mono text-[11px] tracking-[0.35em] text-[#8fbe6a] uppercase">
              field terminal · paper desk
            </p>
            <h1 className="font-heading mt-2 text-6xl tracking-[0.28em] text-[#efe4c4] sm:text-7xl">
              OIL
            </h1>
          </div>
          <nav className="flex flex-wrap items-center gap-5 font-mono text-xs tracking-[0.22em] uppercase">
            <span className="text-[#8fbe6a]">field</span>
            <Link href="/term" className="hover:text-[#efe4c4]">
              shell
            </Link>
            <Link href="/desk" className="hover:text-[#efe4c4]">
              desk
            </Link>
            <button
              type="button"
              onClick={() => void poke()}
              disabled={refreshing}
              className="hover:text-[#efe4c4] disabled:opacity-50"
            >
              {refreshing ? "reading…" : "refresh tape"}
            </button>
          </nav>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-5">
            <p className="font-catalog max-w-xl text-xl leading-snug text-[#efe4c4]">
              Six pumps reading the oil majors. One paper token.
              The tape is real. The barrel is not.
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-[#d7c39a]/75">
              $OIL is a weighted blend of Exxon, Chevron, ConocoPhillips,
              Shell, BP, and Occidental. Each unit below is one name on that
              blend. If they print, the peg prints.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 font-mono text-xs sm:grid-cols-4 lg:grid-cols-2">
            <Stat label="peg" value={formatUsd(market.price, true)} />
            <Stat
              label="today"
              value={formatPercent(market.changePercent)}
              hot={up}
            />
            <Stat label="units" value="6" />
            <Stat
              label="tape"
              value={market.source === "live" ? "live" : "held"}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-catalog text-2xl text-[#efe4c4]">
              From the patch
            </h2>
            <p className="font-mono text-[11px] tracking-[0.2em] text-[#8fbe6a] uppercase">
              {TOKEN.symbol} = blend / {TOKEN.divisor}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {market.rows.map((row, index) => (
              <PumpUnit key={row.symbol} row={row} index={index} />
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <h2 className="font-catalog text-2xl text-[#efe4c4]">
              How the pair holds
            </h2>
            <p className="text-sm leading-relaxed text-[#d7c39a]/80">
              Not a claim on crude. Not a share of the majors. A paper index
              with fixed weights and a cursed divisor, rebuilt whenever the
              tape moves.
            </p>
            <pre className="overflow-x-auto rounded-sm border border-[#d7c39a]/20 bg-black/40 p-4 font-mono text-[11px] leading-6 text-[#8fbe6a] sm:text-xs">
              {`OIL = (0.24 XOM + 0.20 CVX + 0.16 COP
    + 0.16 SHEL + 0.12 BP + 0.12 OXY) / ${TOKEN.divisor}`}
            </pre>
            {market.wti ? (
              <p className="font-mono text-xs tracking-wide text-[#d7c39a]/70">
                WTI weather {formatUsd(market.wti.price)}{" "}
                {formatPercent(market.wti.changePercent)} · not in the blend
              </p>
            ) : (
              <p className="font-mono text-xs text-[#d7c39a]/50">
                WTI lamp is dark. The six units still read.
              </p>
            )}
          </div>
          <FieldTicket price={market.price} />
        </section>

        <footer className="border-t border-[#d7c39a]/15 pt-6 text-[11px] leading-relaxed text-[#d7c39a]/50">
          Experimental paper desk. Quotes from Yahoo Finance when the tape
          answers. Not financial advice, not a security, not an on-chain
          listing. The chrome desk and the shell are still on the lot.
        </footer>
      </div>
    </div>
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
    <div className="border border-[#d7c39a]/15 bg-black/30 px-3 py-3">
      <p className="tracking-[0.2em] text-[#d7c39a]/50 uppercase">{label}</p>
      <p
        className={`mt-1 text-sm ${hot ? "text-[#8fbe6a]" : "text-[#efe4c4]"}`}
      >
        {value}
      </p>
    </div>
  );
}

function PumpUnit({ row, index }: { row: BasketRow; index: number }) {
  const pumping = row.changePercent >= 0;
  return (
    <article className="pump-bezel border border-[#d7c39a]/18 bg-[#0c100c] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-[#8fbe6a] uppercase">
            unit {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="font-heading mt-1 text-3xl tracking-[0.18em] text-[#efe4c4]">
            {row.symbol}
          </h3>
        </div>
        <span
          className={`font-mono text-[10px] tracking-[0.2em] uppercase ${
            pumping ? "text-[#8fbe6a]" : "text-[#c45c3a]"
          }`}
        >
          {pumping ? "pumping" : "idle"}
        </span>
      </div>
      <p className="font-catalog mt-3 text-sm text-[#d7c39a]/70">
        {UNIT_NOTES[row.symbol] ?? row.name}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-xs">
        <div>
          <p className="text-[#d7c39a]/40">stock</p>
          <p className="text-[#8fbe6a]">{formatUsd(row.price)}</p>
        </div>
        <div>
          <p className="text-[#d7c39a]/40">bag</p>
          <p className="text-[#efe4c4]">{formatWeight(row.weight)}</p>
        </div>
        <div>
          <p className="text-[#d7c39a]/40">day</p>
          <p className={pumping ? "text-[#8fbe6a]" : "text-[#c45c3a]"}>
            {formatPercent(row.changePercent)}
          </p>
        </div>
      </div>
      <p className="mt-4 border-t border-[#d7c39a]/10 pt-3 font-mono text-[11px] text-[#d7c39a]/60">
        prints {formatUsd(row.contribution, true)} of each {TOKEN.symbol}
      </p>
    </article>
  );
}
