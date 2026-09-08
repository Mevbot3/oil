"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PAIR, TOKEN, type MarketSnapshot } from "@/lib/basket";
import { formatUsd } from "@/lib/format";
import { FieldTicket } from "@/components/field-ticket";
import { PairMachine } from "@/components/pair-machine";

export function OilField({
  initialMarket,
}: {
  initialMarket: MarketSnapshot;
}) {
  const [market, setMarket] = useState(initialMarket);
  const [refreshing, setRefreshing] = useState(false);
  const [showTicket, setShowTicket] = useState(false);

  const pair = market.rows[0];

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
    <div className="field-skin relative min-h-full overflow-hidden text-[#d8c6a0]">
      <div className="field-grain pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-10 sm:px-6 lg:py-14">
        <nav className="mb-12 flex w-full items-center justify-between font-mono text-[10px] tracking-[0.28em] text-[#d8c6a0]/50 uppercase">
          <span>oil pair</span>
          <div className="flex gap-5">
            <span className="text-[#c4a36a]">field</span>
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
              {refreshing ? "reading" : "refresh"}
            </button>
          </div>
        </nav>

        <p className="font-mono text-[11px] tracking-[0.45em] text-[#c4a36a] uppercase">
          paired to {PAIR.name}
        </p>
        <h1 className="oil-stamp font-heading mt-3 text-[26vw] leading-[0.8] tracking-[0.18em] text-[#f0d7a0] sm:text-9xl">
          OIL
        </h1>
        <p className="font-catalog mt-5 max-w-md text-center text-lg leading-snug text-[#efe4c4]/85">
          One stock. One token. Exxon moves, {TOKEN.symbol} moves.
        </p>

        <div className="mt-12 w-full">
          {pair ? (
            <PairMachine
              oilPrice={market.price}
              oilChange={market.changePercent}
              xomPrice={pair.price}
              xomChange={pair.changePercent}
              live={market.source === "live"}
            />
          ) : (
            <p className="text-center font-mono text-sm text-[#c45c3a]">
              the pair lamp is dark.
            </p>
          )}
        </div>

        <p className="font-catalog mt-8 max-w-lg text-center text-sm leading-relaxed text-[#d8c6a0]/65">
          {TOKEN.symbol} is Exxon&apos;s last print, divided by {TOKEN.divisor}.
          Not a barrel. Not a basket. Just {PAIR.symbol} on the glass.
        </p>

        <button
          type="button"
          onClick={() => setShowTicket((value) => !value)}
          className="mt-10 border border-[#c4a36a]/40 px-5 py-2 font-mono text-[10px] tracking-[0.32em] text-[#c4a36a] uppercase hover:border-[#c4a36a] hover:text-[#efe4c4]"
        >
          {showTicket ? "close window" : "open window"}
        </button>

        {showTicket ? (
          <div className="mt-6 w-full max-w-md border border-[#c4a36a]/20 bg-black/30 p-5">
            <FieldTicket price={market.price} />
          </div>
        ) : null}

        <footer className="mt-16 w-full border-t border-[#d8c6a0]/10 pt-5 text-center text-[11px] leading-relaxed text-[#d8c6a0]/35">
          Paper pair against {PAIR.symbol} {pair ? formatUsd(pair.price) : ""}.
          Experimental desk. Not advice.
        </footer>
      </div>
    </div>
  );
}
