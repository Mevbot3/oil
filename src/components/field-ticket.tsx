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
    <div className="space-y-4">
      <p>
        A clerk window on the peg. Paper only. Nothing is wired, burned, or
        sent anywhere.
      </p>
      <div className="flex gap-2 font-mono text-[10px] tracking-[0.18em] uppercase">
        <button
          type="button"
          className={`border px-3 py-1.5 ${
            side === "buy"
              ? "border-[#8fbe6a] text-[#8fbe6a]"
              : "border-[#cfc3a6]/20 text-[#cfc3a6]/55"
          }`}
          onClick={() => {
            setSide("buy");
            setFill(null);
          }}
        >
          take
        </button>
        <button
          type="button"
          className={`border px-3 py-1.5 ${
            side === "sell"
              ? "border-[#c45c3a] text-[#c45c3a]"
              : "border-[#cfc3a6]/20 text-[#cfc3a6]/55"
          }`}
          onClick={() => {
            setSide("sell");
            setFill(null);
          }}
        >
          lift
        </button>
      </div>
      <label className="block space-y-2">
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#cfc3a6]/45 uppercase">
          {side === "buy" ? "dollars" : TOKEN.ticker}
        </span>
        <input
          inputMode="decimal"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setFill(null);
          }}
          className="h-11 w-full border border-[#cfc3a6]/15 bg-transparent px-3 font-mono text-[#efe4c4] outline-none focus:border-[#8fbe6a]"
        />
      </label>
      <p className="font-mono text-sm text-[#8fbe6a]">
        {quote ?? "enter a size"}
        <span className="ml-3 text-[10px] text-[#cfc3a6]/40">
          @ {formatUsd(price, true)}
        </span>
      </p>
      <button
        type="button"
        disabled={!valid}
        onClick={() => {
          if (!quote) {
            return;
          }
          setFill(
            side === "buy"
              ? `stamped. ${quote} on the blotter.`
              : `lifted. ${quote} back on the rail.`,
          );
        }}
        className="h-10 border border-[#8fbe6a]/70 px-4 font-mono text-[10px] tracking-[0.28em] text-[#8fbe6a] uppercase disabled:opacity-40"
      >
        {side === "buy" ? "stamp" : "lift"}
      </button>
      {fill ? (
        <p className="font-mono text-xs text-[#8fbe6a]">{fill}</p>
      ) : null}
      {!valid && amount.length > 0 ? (
        <p className="font-mono text-xs text-[#c45c3a]">size above zero.</p>
      ) : null}
    </div>
  );
}
