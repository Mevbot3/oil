import type { StockQuote } from "@/lib/basket";

// Robinhood's public stock page ships the quote it renders inside the HTML
// payload, so we read the barrel straight off the page the user linked.
const STOCK_PAGE = "https://robinhood.com/us/en/stocks";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "en-US,en;q=0.9",
};

type RobinhoodQuote = {
  symbol?: string;
  last_trade_price?: string;
  last_extended_hours_trade_price?: string | null;
  previous_close?: string;
  adjusted_previous_close?: string;
  trading_halted?: boolean;
};

function toNumber(value: string | null | undefined): number | null {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

// The embedded quote object is flat, so matching up to the first closing brace
// is enough and avoids dragging in a JSON parser for the whole page.
function extractQuote(html: string, symbol: string): RobinhoodQuote | null {
  const pattern = /"quote":\s*\{[^{}]*\}/g;
  for (const match of html.matchAll(pattern)) {
    const body = match[0].slice('"quote":'.length);
    try {
      const parsed = JSON.parse(body) as RobinhoodQuote;
      if (parsed.symbol === symbol) {
        return parsed;
      }
    } catch {
      // a "quote" key that is not the one we want; keep looking
    }
  }
  return null;
}

export async function fetchRobinhoodQuote(
  symbol: string,
  name: string,
): Promise<StockQuote> {
  const response = await fetch(`${STOCK_PAGE}/${encodeURIComponent(symbol)}/`, {
    headers: BROWSER_HEADERS,
    cache: "no-store",
    signal: AbortSignal.timeout(9000),
  });

  if (!response.ok) {
    throw new Error(`Robinhood ${symbol} returned ${response.status}`);
  }

  const quote = extractQuote(await response.text(), symbol);
  if (!quote) {
    throw new Error(`No Robinhood quote found for ${symbol}`);
  }

  const price = toNumber(quote.last_trade_price);
  const previousClose =
    toNumber(quote.adjusted_previous_close) ?? toNumber(quote.previous_close);

  if (price === null) {
    throw new Error(`Robinhood ${symbol} quote had no price`);
  }

  const changePercent =
    previousClose && previousClose > 0
      ? ((price - previousClose) / previousClose) * 100
      : 0;

  return { symbol, name, price, changePercent, currency: "USD" };
}
