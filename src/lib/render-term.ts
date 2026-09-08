import { TOKEN, type MarketSnapshot } from "@/lib/basket";
import {
  formatCompact,
  formatPercent,
  formatUsd,
  formatWeight,
} from "@/lib/format";

const NICKNAMES: Record<string, string> = {
  XOM: "daddy",
  CVX: "the other daddy",
  COP: "conoco degen",
  SHEL: "shell yeah",
  BP: "british petroleum (real)",
  OXY: "permian gremlin",
};

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
    "  oil            live peg + the oil daddies",
    "  ape <usd>      paper-buy $OIL at the peg",
    "  sell <oil>     paper-dump $OIL (coward)",
    "  poke           refresh the yahoo tape",
    "  whitepaper     the whole joke",
    "  oilnomics      how the bag is split",
    "  desk           open the chrome version",
    "  clear          wipe the phosphor",
    "  help           this sludge",
  ].join("\n");
}

export function renderQuote(market: MarketSnapshot): string {
  const mood = market.changePercent >= 0 ? "EUPHORIA" : "COPIUM";
  const tape = market.source === "live" ? "LIVE TAPE" : "CACHED SLUDGE";
  const lines = [
    OIL_BANNER,
    "",
    `${TOKEN.symbol}  ${formatUsd(market.price, true)}  ${formatPercent(market.changePercent)}  [${mood}]  [${tape}]`,
    TOKEN.tagline,
    `formula  (0.24 XOM + 0.20 CVX + 0.16 COP + 0.16 SHEL + 0.12 BP + 0.12 OXY) / ${TOKEN.divisor}`,
    "",
    renderDaddies(market),
  ];
  if (market.wti) {
    lines.push(
      "",
      `wti weather  ${formatUsd(market.wti.price)}  ${formatPercent(market.wti.changePercent)}  (not in the peg)`,
    );
  }
  return lines.join("\n");
}

export function renderDaddies(market: MarketSnapshot): string {
  const header = pad("sym", 6) + pad("who", 26) + pad("bag", 6) + pad("stock", 12) + pad("today", 10) + "$OIL juice";
  const rule = "-".repeat(header.length);
  const rows = market.rows.map((row) => {
    return (
      pad(row.symbol, 6) +
      pad(NICKNAMES[row.symbol] ?? row.name, 26) +
      pad(formatWeight(row.weight), 6) +
      pad(formatUsd(row.price), 12) +
      pad(formatPercent(row.changePercent), 10) +
      formatUsd(row.contribution, true)
    );
  });
  return ["the oil daddies", rule, header, rule, ...rows, rule].join("\n");
}

export function renderWhitepaper(): string {
  return [
    "WHITEPAPER.TXT",
    "",
    "$OIL is not a claim on barrels. it is a meme index.",
    "six oil stocks. fixed weights. one cursed divisor.",
    "",
    `OIL = (0.24 XOM + 0.20 CVX + 0.16 COP + 0.16 SHEL + 0.12 BP + 0.12 OXY) / ${TOKEN.divisor}`,
    "",
    "if daddy Exxon pumps, we pump.",
    "if daddy Exxon dumps, we post through it.",
    "WTI is the weather. we do not pair to the weather.",
  ].join("\n");
}

export function renderOilnomics(): string {
  return [
    "OILNOMICS",
    "  40%   LP so we don't eat sand",
    "  25%   airdrop for oilmaxxis",
    "  20%   strategic petroleum group chat",
    "  15%   devs (locked, we have jobs)",
    "  ---",
    "  1B    $OIL total supply. the float is a story. the peg is the product.",
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
    "come back when xom rips.",
  ].join("\n");
}

function pad(value: string, width: number): string {
  if (value.length >= width) {
    return `${value.slice(0, width - 1)} `;
  }
  return value + " ".repeat(width - value.length);
}
