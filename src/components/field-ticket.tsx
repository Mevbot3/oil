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
      <p className="font-heading text-3xl tracking-wide text-[#ffe08a]">
        APE MACHINE
      </p>
      <p className="text-sm text-[#f0d7a0]/70">
        dump dollars. become oil. no wallet. no chain. just USO.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className={`flex-1 py-2 font-heading tracking-wide ${
            side === "buy"
              ? "bg-[#f0b429] text-[#1a1208]"
              : "border border-[#f0b429]/40 text-[#f0d7a0]"
          }`}
          onClick={() => {
            setSide("buy");
            setFill(null);
          }}
        >
          APE $OIL
        </button>
        <button
          type="button"
          className={`flex-1 py-2 font-heading tracking-wide ${
            side === "sell"
              ? "bg-[#ff6b4a] text-[#1a1208]"
              : "border border-[#f0b429]/40 text-[#f0d7a0]"
          }`}
          onClick={() => {
            setSide("sell");
            setFill(null);
          }}
        >
          SELL (COPE)
        </button>
      </div>
      <label className="block space-y-2">
        <span className="font-heading text-xs tracking-wide text-[#f0b429]">
          {side === "buy" ? "DOLLARS IN" : `${TOKEN.ticker} OUT`}
        </span>
        <input
          inputMode="decimal"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setFill(null);
          }}
          className="h-12 w-full border-2 border-[#f0b429]/40 bg-transparent px-3 font-heading text-2xl text-[#ffe08a] outline-none focus:border-[#f0b429]"
        />
      </label>
      <p className="font-heading text-2xl text-[#c8f08a]">
        {quote ?? "TYPE A NUMBER COWARD"}
      </p>
      <button
        type="button"
        disabled={!valid}
        onPointerDown={() => {
          if (!quote) {
            return;
          }
          setFill(
            side === "buy"
              ? `FILLED. ${quote} just got slathered on you. you are oil now.`
              : `FILLED. ${quote} back. coward. come back when uso rips.`,
          );
        }}
        className="relative z-30 h-12 w-full bg-[#f0b429] font-heading text-xl tracking-[0.2em] text-[#1a1208] disabled:opacity-40"
      >
        {side === "buy" ? "DRILL $OIL" : "I NEED RENT"}
      </button>
      {fill ? (
        <p
          role="status"
          className="border-2 border-[#8fbe6a] bg-[#143018] px-3 py-3 font-heading text-base text-[#c8f08a]"
        >
          {fill}
        </p>
      ) : null}
      {!valid && amount.length > 0 ? (
        <p className="font-heading text-sm text-[#ff6b4a]">
          more than zero. this is not that kind of bit.
        </p>
      ) : null}
    </div>
  );
}
