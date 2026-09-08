"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { BasketRow, MarketSnapshot } from "@/lib/basket";
import { TOKEN } from "@/lib/basket";
import { formatPercent, formatUsd, formatWeight } from "@/lib/format";
import { FieldTicket } from "@/components/field-ticket";
import { YardScreen } from "@/components/yard-screen";

const UNIT_NOTES: Record<string, string> = {
  XOM: "Baytown plate. The heavy weight.",
  CVX: "Richmond plate. Second on the blend.",
  COP: "Midland plate. Crude and gas in the same lamp.",
  SHEL: "North Sea plate. London hours leak through.",
  BP: "Aberdeen plate. Smallest major, still on the bar.",
  OXY: "Permian plate. Last weight, first to jump.",
};

export function OilField({
  initialMarket,
}: {
  initialMarket: MarketSnapshot;
}) {
  const [market, setMarket] = useState(initialMarket);
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState<string | null>("lede");

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
  const pumping = market.rows.filter((row) => row.changePercent >= 0).length;

  return (
    <div className="field-skin min-h-full text-[#cfc3a6]">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-10 sm:px-6 lg:py-16">
        <nav className="mb-16 flex w-full items-center justify-between font-mono text-[10px] tracking-[0.28em] text-[#cfc3a6]/55 uppercase">
          <span>oil yard</span>
          <div className="flex gap-5">
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
              {refreshing ? "reading" : "refresh"}
            </button>
          </div>
        </nav>

        <p className="font-mono text-[10px] tracking-[0.42em] text-[#8fbe6a] uppercase">
          paper token · oil majors
        </p>
        <h1 className="font-heading mt-4 text-[22vw] leading-none tracking-[0.22em] text-[#efe4c4] sm:text-8xl">
          OIL
        </h1>
        <button
          type="button"
          onClick={() => setOpen(open === "lede" ? null : "lede")}
          className="font-catalog mt-6 max-w-md text-center text-lg leading-snug text-[#efe4c4]/90"
        >
          Six field units that still read the oil majors.
          <span className="ml-2 font-mono text-xs text-[#8fbe6a]">
            {open === "lede" ? "▴" : "▾"}
          </span>
        </button>
        {open === "lede" ? (
          <p className="mt-4 max-w-md text-center text-sm leading-relaxed text-[#cfc3a6]/70">
            One token. Fixed weights. A divisor that should not have survived
            committee. If Exxon and Chevron print, $OIL prints. The barrel
            stays in the ground. The tape does not.
          </p>
        ) : null}

        <div className="mt-10 flex flex-wrap justify-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
          <Chip
            label="peg"
            value={formatUsd(market.price, true)}
            tone={up ? "live" : "idle"}
          />
          <Chip
            label="tape"
            value={market.source === "live" ? "open" : "held"}
            tone={market.source === "live" ? "live" : "idle"}
          />
          <Chip label="units" value="6" />
          <Chip label="pumping" value={String(pumping)} tone="live" />
        </div>

        <div className="mt-16 w-full max-w-md">
          <YardScreen
            plate={TOKEN.symbol}
            readout={formatUsd(market.price, true)}
            sub={`${formatPercent(market.changePercent)}   blend / ${TOKEN.divisor}`}
            live={market.source === "live"}
            className="w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
          />
          <p className="font-catalog mt-3 text-center text-sm italic text-[#cfc3a6]/55">
            Yard master. Rebuilds from the six plates below.
          </p>
        </div>

        <section className="mt-20 w-full">
          <div className="mb-6 flex items-end justify-between gap-3">
            <h2 className="font-catalog text-xl text-[#efe4c4]">In the yard</h2>
            <p className="font-mono text-[10px] tracking-[0.22em] text-[#8fbe6a] uppercase">
              six plates
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-2">
            {market.rows.map((row, index) => (
              <PumpPlate key={row.symbol} row={row} index={index} />
            ))}
          </div>
        </section>

        <div className="mt-20 w-full space-y-3">
          <Fold
            id="blend"
            title="The blend"
            open={open}
            onToggle={setOpen}
          >
            <p>
              Not a claim on crude and not a share of the majors. A paper
              index. Six names, fixed weights, one divisor, rebuilt when the
              tape moves.
            </p>
            <pre className="mt-4 overflow-x-auto font-mono text-[11px] leading-6 text-[#8fbe6a]">
              {`OIL = (0.24 XOM + 0.20 CVX + 0.16 COP
    + 0.16 SHEL + 0.12 BP + 0.12 OXY) / ${TOKEN.divisor}`}
            </pre>
            {market.wti ? (
              <p className="mt-4 font-mono text-[11px] text-[#cfc3a6]/55">
                WTI {formatUsd(market.wti.price)}{" "}
                {formatPercent(market.wti.changePercent)} is weather. It is
                not a seventh plate.
              </p>
            ) : (
              <p className="mt-4 font-mono text-[11px] text-[#cfc3a6]/40">
                WTI lamp is dark. The six plates still read.
              </p>
            )}
          </Fold>
          <Fold
            id="window"
            title="The window"
            open={open}
            onToggle={setOpen}
          >
            <FieldTicket price={market.price} />
          </Fold>
          <Fold
            id="bags"
            title="The bags"
            open={open}
            onToggle={setOpen}
          >
            <ul className="space-y-2 font-mono text-xs text-[#cfc3a6]/75">
              <li>40% — rail so the peg has a floor to stand on</li>
              <li>25% — patch list, if a list ever gets posted</li>
              <li>20% — yard reserve</li>
              <li>15% — keepers, locked</li>
            </ul>
          </Fold>
        </div>

        <footer className="mt-20 w-full border-t border-[#cfc3a6]/10 pt-6 text-center text-[11px] leading-relaxed text-[#cfc3a6]/40">
          Experimental paper yard. Quotes from the public tape when it
          answers. Not a listing, not a security, not advice. Shell and desk
          are still on the lot.
        </footer>
      </div>
    </div>
  );
}

function Chip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "live" | "idle";
}) {
  const color =
    tone === "live"
      ? "border-[#8fbe6a]/40 text-[#8fbe6a]"
      : tone === "idle"
        ? "border-[#c45c3a]/40 text-[#c45c3a]"
        : "border-[#cfc3a6]/20 text-[#cfc3a6]";
  return (
    <span className={`border px-2.5 py-1 ${color}`}>
      {label} {value}
    </span>
  );
}

function Fold({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: string | null;
  onToggle: (id: string | null) => void;
  children: ReactNode;
}) {
  const shown = open === id;
  return (
    <section className="border-t border-[#cfc3a6]/12 py-4">
      <button
        type="button"
        onClick={() => onToggle(shown ? null : id)}
        className="flex w-full items-baseline justify-between gap-4 text-left"
      >
        <span className="font-catalog text-xl text-[#efe4c4]">{title}</span>
        <span className="font-mono text-xs text-[#8fbe6a]">
          {shown ? "▴" : "▾"}
        </span>
      </button>
      {shown ? (
        <div className="mt-4 text-sm leading-relaxed text-[#cfc3a6]/75">
          {children}
        </div>
      ) : null}
    </section>
  );
}

function PumpPlate({ row, index }: { row: BasketRow; index: number }) {
  const pumping = row.changePercent >= 0;
  return (
    <figure>
      <YardScreen
        plate={`U${String(index + 1).padStart(2, "0")} ${row.symbol}`}
        readout={formatUsd(row.price)}
        sub={`${formatWeight(row.weight)}   ${formatPercent(row.changePercent)}`}
        live={pumping}
        className="w-full"
      />
      <figcaption className="mt-3">
        <p className="font-catalog text-[#efe4c4]">
          {row.symbol}
          <span className="ml-2 font-mono text-[10px] tracking-[0.18em] text-[#cfc3a6]/45 uppercase">
            {pumping ? "pumping" : "idle"}
          </span>
        </p>
        <p className="font-catalog mt-1 text-sm italic text-[#cfc3a6]/55">
          {UNIT_NOTES[row.symbol] ?? row.name}
        </p>
        <p className="mt-1 font-mono text-[10px] tracking-wide text-[#cfc3a6]/40">
          prints {formatUsd(row.contribution, true)} of {TOKEN.symbol}
        </p>
      </figcaption>
    </figure>
  );
}
