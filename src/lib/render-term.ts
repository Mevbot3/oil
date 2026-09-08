import { PAIR, TOKEN, type MarketSnapshot } from "@/lib/basket";
import {
  formatCompact,
  formatPercent,
  formatUsd,
} from "@/lib/format";

export const OIL_BANNER = String.raw`
  ██████╗ ██╗██╗
 ██╔═══██╗██║██║
 ██║   ██║██║██║
 ██║   ██║██║██║
 ╚██████╔╝██║███████╗
  ╚═════╝ ╚═╝╚══════╝
`.trimEnd();

export function renderHelp(): string {
  return [
    "commands",
    "  oil            live peg against USO",
    "  ape <usd>      paper-buy $OIL at the peg",
    "  sell <oil>     paper-dump $OIL",
    "  poke           refresh the yahoo tape",
    "  whitepaper     the whole joke",
    "  oilnomics      how the bag is split",
    "  field          open the field terminal",
    "  desk           open the chrome version",
    "  clear          wipe the phosphor",
    "  help           this sludge",
  ].join("\n");
}

export function renderQuote(market: MarketSnapshot): string {
  const pair = market.rows[0];
  const mood = market.changePercent >= 0 ? "EUPHORIA" : "COPIUM";
  const tape = market.source === "live" ? "LIVE TAPE" : "CACHED SLUDGE";
  return [
    OIL_BANNER,
    "",
    `${TOKEN.symbol}  ${formatUsd(market.price, true)}  ${formatPercent(market.changePercent)}  [${mood}]  [${tape}]`,
    TOKEN.tagline,
    `formula  ${PAIR.symbol} / ${TOKEN.divisor}`,
    pair
      ? `pair     ${pair.symbol}  ${formatUsd(pair.price)}  ${formatPercent(pair.changePercent)}  ${pair.name}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function renderDaddies(market: MarketSnapshot): string {
  return renderQuote(market);
}

export function renderWhitepaper(): string {
  return [
    "WHITEPAPER.TXT",
    "",
    "$OIL is not a barrel. it is USO, divided.",
    "",
    `OIL = ${PAIR.symbol} / ${TOKEN.divisor}`,
    "",
    "3/3 fees. 3/3 redirects to holders.",
    "automatically, through the ponds, paid in USO.",
    "if the fund pumps, we pump.",
  ].join("\n");
}

export function renderOilnomics(): string {
  return [
    "OILNOMICS",
    "  3%    buy tax",
    "  3%    sell tax",
    "  3/3   redirect to holders",
    "  ---",
    "  paid  USO, automatic, through the ponds",
    "  1B    $OIL. one pair. USO.",
  ].join("\n");
}

export function renderApe(price: number, usd: number): string {
  if (!(usd > 0) || !(price > 0)) {
    return "ape: more than zero. this is not that kind of bit.";
  }
  const tokens = usd / price;
  return [
    `filled. ${formatCompact(tokens)} ${TOKEN.ticker} just got slathered on you.`,
    `paid ${formatUsd(usd)} @ ${formatUsd(price, true)}  ·  0% tax  ·  paper oil only`,
    "you are oil now.",
  ].join("\n");
}

export function renderSell(price: number, tokens: number): string {
  if (!(tokens > 0) || !(price > 0)) {
    return "sell: more than zero, coward.";
  }
  const usd = tokens * price;
  return [
    `filled. ${formatUsd(usd)} back.`,
    `dumped ${formatCompact(tokens)} ${TOKEN.ticker} @ ${formatUsd(price, true)}`,
    "come back when uso rips.",
  ].join("\n");
}
