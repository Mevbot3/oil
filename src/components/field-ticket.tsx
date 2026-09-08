"use client";

import { useMemo, useState } from "react";
import { TOKEN } from "@/lib/basket";
import { formatCompact, formatUsd } from "@/lib/format";

type Side = "buy" | "sell";

export function FieldTicket({ price }: { price: number }) {
  const [side, setSide] = useState<Side>("buy");
  const [amount, setAmount] = useState("69");
  const [fill, setFill] = useState<string | null>(null);

  const parsed = Number(amount);
  const valid = Number.isFinite(parsed) && parsed > 0 && price > 0;

  const quote = useMemo(() => {
    if (!valid) {
      return null;
    }
    return side === "buy"
      ? `${formatCompact(parsed / price)} ${TOKEN.ticker}`
      : formatUsd(parsed * price);
  }, [parsed, price, side, valid]);

  return (
    <div className="border border-[#d7c39a]/20 bg-black/35 p-5">
      <div className="flex items-end justify-between gap-3">
        <h2 className="font-catalog text-2xl text-[#efe4c4]">Ticket window</h2>
        <p className="font-mono text-[10px] tracking-[0.2em] text-[#8fbe6a] uppercase">
          paper only
        </p>
      </div>
      <p className="mt-2 text-sm text-[#d7c39a]/70">
        Size a fill at the live peg. Nothing leaves the lot.
      </p>
      <div className="mt-4 flex gap-2 font-mono text-xs tracking-[0.16em] uppercase">
        <button
          type="button"
          className={`border px-3 py-1.5 ${
            side === "buy"
              ? "border-[#8fbe6a] text-[#8fbe6a]"
              : "border-[#d7c39a]/20 text-[#d7c39a]/60"
          }`}
          onClick={() => {
            setSide("buy");
            setFill(null);
          }}
        >
          take oil
        </button>
        <button
          type="button"
          className={`border px-3 py-1.5 ${
            side === "sell"
              ? "border-[#c45c3a] text-[#c45c3a]"
              : "border-[#d7c39a]/20 text-[#d7c39a]/60"
          }`}
          onClick={() => {
            setSide("sell");
            setFill(null);
          }}
        >
          lift oil
        </button>
      </div>
      <label className="mt-4 block space-y-2">
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#d7c39a]/50 uppercase">
          {side === "buy" ? "dollars in" : `${TOKEN.ticker} out`}
        </span>
        <input
          inputMode="decimal"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setFill(null);
          }}
          className="h-11 w-full border border-[#d7c39a]/20 bg-transparent px-3 font-mono text-[#efe4c4] outline-none focus:border-[#8fbe6a]"
        />
      </label>
      <div className="mt-4 border border-dashed border-[#d7c39a]/20 px-3 py-3">
        <p className="font-mono text-[10px] tracking-[0.2em] text-[#d7c39a]/45 uppercase">
          you receive
        </p>
        <p className="mt-1 font-mono text-xl text-[#8fbe6a]">
          {quote ?? "enter a size"}
        </p>
        <p className="mt-1 font-mono text-[11px] text-[#d7c39a]/45">
          peg {formatUsd(price, true)} · 0% window fee
        </p>
      </div>
      <button
        type="button"
        disabled={!valid}
        onClick={() => {
          if (!quote) {
            return;
          }
          setFill(
            side === "buy"
              ? `ticket filled. ${quote} stamped on the blotter.`
              : `ticket lifted. ${quote} back on the rail.`,
          );
        }}
        className="mt-4 h-11 w-full border border-[#8fbe6a] font-mono text-xs tracking-[0.28em] text-[#8fbe6a] uppercase disabled:opacity-40"
      >
        {side === "buy" ? "stamp ticket" : "lift ticket"}
      </button>
      {fill ? (
        <p className="mt-3 font-mono text-xs text-[#8fbe6a]">{fill}</p>
      ) : null}
      {!valid && amount.length > 0 ? (
        <p className="mt-3 font-mono text-xs text-[#c45c3a]">
          size has to be above zero.
        </p>
      ) : null}
    </div>
  );
}
