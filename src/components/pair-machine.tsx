import { PAIR, TOKEN } from "@/lib/basket";
import { formatPercent, formatUsd } from "@/lib/format";

export function PairMachine({
  oilPrice,
  oilChange,
  xomPrice,
  xomChange,
  live,
}: {
  oilPrice: number;
  oilChange: number;
  xomPrice: number;
  xomChange: number;
  live: boolean;
}) {
  const up = oilChange >= 0;

  return (
    <div className="machine relative mx-auto w-full max-w-xl">
      <div className="machine-case rounded-[28px] border border-[#3a2c18] bg-linear-to-b from-[#2a2216] via-[#1a140e] to-[#0c0907] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(232,196,120,0.18)]">
        <div className="mb-3 flex items-center justify-between px-2">
          <span className="font-mono text-[10px] tracking-[0.35em] text-[#c4a36a] uppercase">
            pair unit
          </span>
          <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] uppercase">
            <span
              className={`inline-block size-2 rounded-full ${
                live ? "lamp-live bg-[#8fbe6a]" : "bg-[#5a4030]"
              }`}
            />
            {live ? "on tape" : "held"}
          </span>
        </div>

        <div className="brass-plate mx-auto mb-4 w-fit rounded-sm border border-[#8a6a2a] bg-linear-to-b from-[#e6c56a] to-[#9a7428] px-6 py-1.5 shadow-[inset_0_1px_0_rgba(255,240,180,0.6)]">
          <p className="font-heading text-2xl tracking-[0.35em] text-[#2a1c08]">
            {TOKEN.name}
          </p>
        </div>

        <div className="crt relative overflow-hidden rounded-xl border border-[#143018] bg-[#041208] px-6 py-8 shadow-[inset_0_0_60px_rgba(80,180,60,0.12)]">
          <div className="crt-scan pointer-events-none absolute inset-0" />
          <div className="crt-glow pointer-events-none absolute inset-0" />
          <p className="relative font-mono text-[11px] tracking-[0.38em] text-[#6f9a4a] uppercase">
            {TOKEN.symbol} · paired to {PAIR.symbol}
          </p>
          <p className="phosphor relative mt-3 font-heading text-6xl tracking-wide text-[#c8f08a] sm:text-7xl">
            {formatUsd(oilPrice, true)}
          </p>
          <p
            className={`relative mt-2 font-mono text-sm ${
              up ? "text-[#8fbe6a]" : "text-[#d07050]"
            }`}
          >
            {formatPercent(oilChange)} today
          </p>
          <div className="relative mt-8 grid grid-cols-2 gap-4 border-t border-[#1d3a20] pt-4 font-mono text-xs">
            <div>
              <p className="tracking-[0.2em] text-[#5f7a48] uppercase">
                {PAIR.symbol}
              </p>
              <p className="mt-1 text-lg text-[#b6e07a]">
                {formatUsd(xomPrice)}
              </p>
              <p className={xomChange >= 0 ? "text-[#8fbe6a]" : "text-[#d07050]"}>
                {formatPercent(xomChange)}
              </p>
            </div>
            <div>
              <p className="tracking-[0.2em] text-[#5f7a48] uppercase">
                formula
              </p>
              <p className="mt-1 text-lg text-[#b6e07a]">
                {PAIR.symbol}/{TOKEN.divisor}
              </p>
              <p className="text-[#6f9a4a]">one name. one peg.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between px-1">
          <div className="flex gap-2">
            <span className="size-3 rounded-full bg-[#3a2a14] shadow-[inset_0_-1px_0_#111]" />
            <span className="size-3 rounded-full bg-[#5a2018] shadow-[inset_0_-1px_0_#111]" />
            <span className="size-3 rounded-full bg-[#2a3a18] shadow-[inset_0_-1px_0_#111]" />
          </div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-[#8a7048] uppercase">
            {PAIR.name}
          </p>
        </div>
      </div>
    </div>
  );
}
