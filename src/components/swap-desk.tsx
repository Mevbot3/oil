"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TOKEN } from "@/lib/basket";
import { formatCompact, formatUsd } from "@/lib/format";

type Side = "buy" | "sell";

export function SwapDesk({ price }: { price: number }) {
  const [side, setSide] = useState<Side>("buy");
  const [amount, setAmount] = useState("250");
  const [fill, setFill] = useState<string | null>(null);

  const parsed = Number(amount);
  const valid = Number.isFinite(parsed) && parsed > 0 && price > 0;

  const quote = useMemo(() => {
    if (!valid) {
      return null;
    }
    if (side === "buy") {
      return {
        pay: formatUsd(parsed),
        receive: `${formatCompact(parsed / price)} ${TOKEN.ticker}`,
        rawReceive: parsed / price,
      };
    }
    return {
      pay: `${formatCompact(parsed)} ${TOKEN.ticker}`,
      receive: formatUsd(parsed * price),
      rawReceive: parsed * price,
    };
  }, [parsed, price, side, valid]);

  function drill() {
    if (!quote) {
      return;
    }
    setFill(
      side === "buy"
        ? `Filled. ${quote.receive} printed against the oil-stock peg.`
        : `Filled. ${quote.receive} flowed back out of the barrel.`,
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <Button
          variant={side === "buy" ? "default" : "outline"}
          className="flex-1"
          onClick={() => {
            setSide("buy");
            setFill(null);
          }}
        >
          Buy $GUSH
        </Button>
        <Button
          variant={side === "sell" ? "default" : "outline"}
          className="flex-1"
          onClick={() => {
            setSide("sell");
            setFill(null);
          }}
        >
          Sell $GUSH
        </Button>
      </div>

      <label className="block space-y-2">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {side === "buy" ? "You pay (USD)" : "You sell ($GUSH)"}
        </span>
        <Input
          inputMode="decimal"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setFill(null);
          }}
          className="h-12 font-mono text-lg"
          placeholder={side === "buy" ? "250" : "1000"}
        />
      </label>

      <div className="flex justify-center">
        <div className="flex size-9 items-center justify-center rounded-full border border-border bg-muted/40 text-amber-200">
          <ArrowDownUp className="size-4" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-black/20 px-4 py-3">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          You receive
        </p>
        <p className="mt-1 font-mono text-2xl text-amber-200">
          {quote ? quote.receive : "Enter an amount"}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Peg {formatUsd(price, true)} · 0% protocol spread · paper fill only
        </p>
      </div>

      <Button
        size="lg"
        className="h-11 w-full text-base"
        disabled={!valid}
        onClick={drill}
      >
        {side === "buy" ? "Drill $GUSH" : "Dump the barrel"}
      </Button>

      {fill ? (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {fill}
        </p>
      ) : null}

      {!valid && amount.length > 0 ? (
        <p className="text-sm text-destructive">
          Enter a number above zero to size the fill.
        </p>
      ) : null}
    </div>
  );
}
