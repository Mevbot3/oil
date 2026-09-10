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
  tagline: "if USO pumps, we pump. on Pons. 3/3 to the treasury.",
} as const;

export const PAIR = {
  symbol: "USO",
  name: "United States Oil Fund",
} as const;

export const OIL_MAJORS: OilMajor[] = [
  { symbol: PAIR.symbol, name: PAIR.name, weight: 1 },
];

export const WTI_SYMBOL = "CL=F";

export const FALLBACK_QUOTES: StockQuote[] = [
  {
    symbol: PAIR.symbol,
    name: PAIR.name,
    price: 141.96,
    changePercent: -0.091,
    currency: "USD",
  },
];

export function quoteMap(quotes: StockQuote[]): Map<string, StockQuote> {
  return new Map(quotes.map((quote) => [quote.symbol, quote]));
}

export function computeBasketValue(quotes: StockQuote[]): number {
  const quote = quoteMap(quotes).get(PAIR.symbol);
  if (!quote) {
    throw new Error(`Missing quote for ${PAIR.symbol}`);
  }
  return quote.price;
}

export function computeOilPrice(quotes: StockQuote[]): number {
  return computeBasketValue(quotes) / TOKEN.divisor;
}

export function computeOilChangePercent(quotes: StockQuote[]): number {
  const quote = quoteMap(quotes).get(PAIR.symbol);
  if (!quote) {
    throw new Error(`Missing quote for ${PAIR.symbol}`);
  }
  return quote.changePercent;
}

export function buildBasketRows(quotes: StockQuote[]): BasketRow[] {
  const quote = quoteMap(quotes).get(PAIR.symbol);
  if (!quote) {
    throw new Error(`Missing quote for ${PAIR.symbol}`);
  }
  return [
    {
      ...quote,
      name: PAIR.name,
      weight: 1,
      contribution: quote.price / TOKEN.divisor,
    },
  ];
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
      wti: null,
    });
  }
  return points;
}
