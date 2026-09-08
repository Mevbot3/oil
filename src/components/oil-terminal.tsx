"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MarketSnapshot } from "@/lib/basket";
import {
  renderApe,
  renderHelp,
  renderOilnomics,
  renderQuote,
  renderSell,
  renderWhitepaper,
} from "@/lib/render-term";

type Line = {
  kind: "out" | "cmd" | "sys";
  text: string;
};

export function OilTerminal({
  initialMarket,
}: {
  initialMarket: MarketSnapshot;
}) {
  const [market, setMarket] = useState(initialMarket);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const router = useRouter();
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const boot = [
      "OIL RIG v69  ·  phosphor edition",
      "spudding yahoo tape...",
      ...initialMarket.rows.map(
        (row) =>
          `  ${row.symbol.padEnd(5)} ${row.changePercent >= 0 ? "ok" : "cope"}`,
      ),
      initialMarket.source === "live"
        ? "peg locked. you are talking to live oil stocks."
        : "yahoo blinked. using last known sludge.",
      "",
    ];
    let i = 0;
    const timer = window.setInterval(() => {
      const next = boot[i];
      i += 1;
      if (next === undefined) {
        window.clearInterval(timer);
        setLines((current) => [
          ...current,
          { kind: "cmd", text: "oil" },
          { kind: "out", text: renderQuote(initialMarket) },
          {
            kind: "sys",
            text: "type help. ape 69. sell 1000. poke the tape.",
          },
        ]);
        setBooted(true);
        return;
      }
      setLines((current) => [...current, { kind: "sys", text: next }]);
    }, 90);
    return () => window.clearInterval(timer);
  }, [initialMarket]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines]);

  const prompt = useMemo(() => "oil@rig:~$", []);

  async function run(raw: string) {
    const line = raw.trim();
    if (!line) {
      return;
    }
    setLines((current) => [...current, { kind: "cmd", text: line }]);
    const [command, ...rest] = line.split(/\s+/);
    const arg = rest.join(" ");

    if (command === "clear") {
      setLines([]);
      return;
    }
    if (command === "help" || command === "?") {
      pushOut(renderHelp());
      return;
    }
    if (command === "oil" || command === "quote" || command === "peg") {
      pushOut(renderQuote(market));
      return;
    }
    if (command === "daddies" || command === "ls") {
      pushOut(renderQuote(market));
      return;
    }
    if (command === "whitepaper" || command === "cat") {
      pushOut(renderWhitepaper());
      return;
    }
    if (command === "oilnomics") {
      pushOut(renderOilnomics());
      return;
    }
    if (command === "ape" || command === "buy") {
      pushOut(renderApe(market.price, Number(arg)));
      return;
    }
    if (command === "sell" || command === "dump") {
      pushOut(renderSell(market.price, Number(arg)));
      return;
    }
    if (command === "poke" || command === "refresh") {
      try {
        const response = await fetch("/api/market", { cache: "no-store" });
        const payload = (await response.json()) as MarketSnapshot & {
          error?: string;
        };
        if (!response.ok) {
          throw new Error(payload.error ?? "tape died");
        }
        setMarket(payload);
        pushOut(`tape poked.\n${renderQuote(payload)}`);
      } catch (error) {
        pushOut(
          error instanceof Error ? error.message : "could not poke the tape.",
        );
      }
      return;
    }
    if (command === "field") {
      pushOut("opening the field terminal...");
      router.push("/");
      return;
    }
    if (command === "desk") {
      pushOut("opening the chrome desk...");
      router.push("/desk");
      return;
    }
    if (command === "exit" || command === "quit") {
      pushOut("you cannot exit a website, anon. try desk.");
      return;
    }

    pushOut(`unknown command: ${command}  ·  try help`);
  }

  function pushOut(text: string) {
    setLines((current) => [...current, { kind: "out", text }]);
  }

  return (
    <div
      className="crt relative flex min-h-full flex-1 flex-col bg-[#070604] text-[#f0b429]"
      onClick={() => field.current?.focus()}
    >
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,8,0.12)_50%,transparent_50%)] bg-size-[100%_4px]" />
      <header className="relative z-20 flex items-center justify-between border-b border-[#f0b429]/25 px-4 py-2 font-mono text-[11px] tracking-[0.2em] uppercase">
        <span>oil.exe · paired to oil stocks</span>
        <span className="flex gap-4">
          <Link href="/" className="hover:text-[#ffe08a]">
            /field
          </Link>
          <Link href="/desk" className="hover:text-[#ffe08a]">
            /desk
          </Link>
        </span>
      </header>
      <div
        ref={scroller}
        className="relative z-20 min-h-0 flex-1 overflow-auto px-4 py-4 font-mono text-[13px] leading-6 sm:text-[14px]"
      >
        {lines.map((line, index) => (
          <pre
            key={`${line.kind}-${index}-${line.text.slice(0, 12)}`}
            className={
              line.kind === "cmd"
                ? "whitespace-pre-wrap text-[#ffe08a]"
                : line.kind === "sys"
                  ? "whitespace-pre-wrap text-[#c48920]"
                  : "whitespace-pre-wrap"
            }
          >
            {line.kind === "cmd" ? `${prompt} ${line.text}` : line.text}
          </pre>
        ))}
        <form
          className="mt-2 flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!booted) {
              return;
            }
            const value = input;
            setInput("");
            void run(value);
          }}
        >
          <span className="shrink-0 text-[#ffe08a]">{prompt}</span>
          <input
            ref={field}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            disabled={!booted}
            className="min-w-0 flex-1 border-0 bg-transparent text-[#f0b429] caret-[#ffe08a] outline-none"
            aria-label="terminal command"
          />
          <span className="inline-block h-4 w-2 animate-pulse bg-[#f0b429]" />
        </form>
      </div>
    </div>
  );
}
