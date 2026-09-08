export type OilMajor = {
  symbol: string;
  name: string;
  weight: number;
};

export type StockQuote = {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  currency: string;
};

export type BasketRow = StockQuote & {
  weight: number;
  contribution: number;
};

export type HistoryPoint = {
  date: string;
  oil: number;
  wti: number | null;
};

export type MarketSnapshot = {
  price: number;
  changePercent: number;
  marketCap: number;
  basketValue: number;
  rows: BasketRow[];
  wti: StockQuote | null;
  history: HistoryPoint[];
  source: "live" | "fallback";
  asOf: string;
};

export const TOKEN = {
  name: "OIL",
  ticker: "OIL",
  symbol: "$OIL",
  supply: 1_000_000_000,
  divisor: 69,
  tagline: "if Exxon pumps, we pump. that's the whitepaper.",
} as const;

export const OIL_MAJORS: OilMajor[] = [
  { symbol: "XOM", name: "Exxon Mobil", weight: 0.24 },
  { symbol: "CVX", name: "Chevron", weight: 0.2 },
  { symbol: "COP", name: "ConocoPhillips", weight: 0.16 },
  { symbol: "SHEL", name: "Shell", weight: 0.16 },
  { symbol: "BP", name: "BP", weight: 0.12 },
  { symbol: "OXY", name: "Occidental", weight: 0.12 },
];

export const WTI_SYMBOL = "CL=F";

export const FALLBACK_QUOTES: StockQuote[] = [
  {
    symbol: "XOM",
    name: "Exxon Mobil",
    price: 159.47,
    changePercent: -1.689,
    currency: "USD",
  },
  {
    symbol: "CVX",
    name: "Chevron",
    price: 208.6,
    changePercent: -1.287,
    currency: "USD",
  },
  {
    symbol: "COP",
    name: "ConocoPhillips",
    price: 134.26,
    changePercent: -1.076,
    currency: "USD",
  },
  {
    symbol: "SHEL",
    name: "Shell",
    price: 92.95,
    changePercent: 0.671,
    currency: "USD",
  },
  {
    symbol: "BP",
    name: "BP",
    price: 43.81,
    changePercent: 0.528,
    currency: "USD",
  },
  {
    symbol: "OXY",
    name: "Occidental",
    price: 60.04,
    changePercent: -0.94,
    currency: "USD",
  },
];

export const FALLBACK_WTI: StockQuote = {
  symbol: WTI_SYMBOL,
  name: "WTI Crude",
  price: 92.86,
  changePercent: 1.509,
  currency: "USD",
};

export function quoteMap(quotes: StockQuote[]): Map<string, StockQuote> {
  return new Map(quotes.map((quote) => [quote.symbol, quote]));
}

export function computeBasketValue(quotes: StockQuote[]): number {
  const bySymbol = quoteMap(quotes);
  return OIL_MAJORS.reduce((sum, major) => {
    const quote = bySymbol.get(major.symbol);
    if (!quote) {
      throw new Error(`Missing quote for ${major.symbol}`);
    }
    return sum + major.weight * quote.price;
  }, 0);
}

export function computeOilPrice(quotes: StockQuote[]): number {
  return computeBasketValue(quotes) / TOKEN.divisor;
}

export function computeOilChangePercent(quotes: StockQuote[]): number {
  const bySymbol = quoteMap(quotes);
  return OIL_MAJORS.reduce((sum, major) => {
    const quote = bySymbol.get(major.symbol);
    if (!quote) {
      throw new Error(`Missing quote for ${major.symbol}`);
    }
    return sum + major.weight * quote.changePercent;
  }, 0);
}

export function buildBasketRows(quotes: StockQuote[]): BasketRow[] {
  const bySymbol = quoteMap(quotes);
  return OIL_MAJORS.map((major) => {
    const quote = bySymbol.get(major.symbol);
    if (!quote) {
      throw new Error(`Missing quote for ${major.symbol}`);
    }
    return {
      ...quote,
      name: major.name,
      weight: major.weight,
      contribution: (major.weight * quote.price) / TOKEN.divisor,
    };
  });
}

export function snapshotFromQuotes(
  quotes: StockQuote[],
  wti: StockQuote | null,
  history: HistoryPoint[],
  source: "live" | "fallback",
): MarketSnapshot {
  const price = computeOilPrice(quotes);
  return {
    price,
    changePercent: computeOilChangePercent(quotes),
    marketCap: price * TOKEN.supply,
    basketValue: computeBasketValue(quotes),
    rows: buildBasketRows(quotes),
    wti,
    history,
    source,
    asOf: new Date().toISOString(),
  };
}

export function fallbackHistory(): HistoryPoint[] {
  const seedPrice = computeOilPrice(FALLBACK_QUOTES);
  const days = 90;
  const points: HistoryPoint[] = [];
  for (let i = days; i >= 0; i -= 1) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - i);
    const wave = Math.sin(i / 9) * 0.06 + Math.cos(i / 17) * 0.03;
    const drift = (days - i) * 0.0008;
    points.push({
      date: date.toISOString().slice(0, 10),
      oil: Number((seedPrice * (0.92 + drift + wave)).toFixed(4)),
      wti: Number((FALLBACK_WTI.price * (0.9 + drift * 0.4 + wave * 0.5)).toFixed(2)),
    });
  }
  return points;
}
