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
  const [amount, setAmount] = useState("69");
  const [fill, setFill] = useState<string | null>(null);

  const parsed = Number(amount);
  const valid = Number.isFinite(parsed) && parsed > 0 && price > 0;

  const quote = useMemo(() => {
    if (!valid) {
      return null;
    }
    if (side === "buy") {
      return {
        receive: `${formatCompact(parsed / price)} ${TOKEN.ticker}`,
      };
    }
    return {
      receive: formatUsd(parsed * price),
    };
  }, [parsed, price, side, valid]);

  function ape() {
    if (!quote) {
      return;
    }
    setFill(
      side === "buy"
        ? `filled. ${quote.receive} just got slathered on you. you are oil now.`
        : `filled. ${quote.receive} back. coward. come back when xom rips.`,
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <Button
          variant={side === "buy" ? "default" : "outline"}
          className="flex-1 font-heading text-base tracking-wide"
          onClick={() => {
            setSide("buy");
            setFill(null);
          }}
        >
          APE $OIL
        </Button>
        <Button
          variant={side === "sell" ? "default" : "outline"}
          className="flex-1 font-heading text-base tracking-wide"
          onClick={() => {
            setSide("sell");
            setFill(null);
          }}
        >
          SELL (COPE)
        </Button>
      </div>

      <label className="block space-y-2">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {side === "buy" ? "dump dollars in" : "peel $OIL off"}
        </span>
        <Input
          inputMode="decimal"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setFill(null);
          }}
          className="h-12 font-mono text-lg"
          placeholder={side === "buy" ? "69" : "1000"}
        />
      </label>

      <div className="flex justify-center">
        <div className="flex size-9 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-200">
          <ArrowDownUp className="size-4" />
        </div>
      </div>

      <div className="rounded-xl border border-amber-400/30 bg-black/30 px-4 py-3">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          you get
        </p>
        <p className="mt-1 font-heading text-3xl tracking-wide text-amber-200">
          {quote ? quote.receive : "type a number coward"}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          peg {formatUsd(price, true)} · 0% tax · paper oil only
        </p>
      </div>

      <Button
        size="lg"
        className="h-12 w-full font-heading text-lg tracking-widest"
        disabled={!valid}
        onClick={ape}
      >
        {side === "buy" ? "DRILL $OIL" : "I NEED RENT"}
      </Button>

      {fill ? (
        <p className="rotate-[-1deg] rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-200">
          {fill}
        </p>
      ) : null}

      {!valid && amount.length > 0 ? (
        <p className="text-sm text-destructive">
          more than zero. this is not that kind of bit.
        </p>
      ) : null}
    </div>
  );
}
