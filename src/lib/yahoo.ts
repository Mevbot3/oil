import {
  FALLBACK_QUOTES,
  FALLBACK_WTI,
  OIL_MAJORS,
  TOKEN,
  WTI_SYMBOL,
  fallbackHistory,
  snapshotFromQuotes,
  type HistoryPoint,
  type MarketSnapshot,
  type StockQuote,
} from "@/lib/basket";

const YAHOO_HEADERS = {
  Accept: "application/json",
  "User-Agent":
    "Mozilla/5.0 (compatible; GusherBot/1.0; +https://gusher.local)",
};

type YahooChart = {
  chart?: {
    result?: Array<{
      meta?: {
        currency?: string;
        symbol?: string;
        shortName?: string;
        longName?: string;
        regularMarketPrice?: number;
        regularMarketChangePercent?: number;
      };
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          close?: Array<number | null>;
        }>;
      };
    }>;
    error?: { description?: string } | null;
  };
};

export type YahooSeries = {
  quote: StockQuote;
  closes: Array<{ date: string; close: number }>;
};

function formatDay(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toISOString().slice(0, 10);
}

export async function fetchYahooSeries(
  symbol: string,
  range = "3mo",
): Promise<YahooSeries> {
  const url = new URL(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`,
  );
  url.searchParams.set("interval", "1d");
  url.searchParams.set("range", range);
  url.searchParams.set("includePrePost", "false");

  const response = await fetch(url, {
    headers: YAHOO_HEADERS,
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Yahoo ${symbol} returned ${response.status}`);
  }

  const payload = (await response.json()) as YahooChart;
  const result = payload.chart?.result?.[0];
  const meta = result?.meta;
  const price = meta?.regularMarketPrice;

  if (!result || !meta || typeof price !== "number" || Number.isNaN(price)) {
    throw new Error(
      payload.chart?.error?.description ?? `No quote for ${symbol}`,
    );
  }

  const timestamps = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];
  const history: Array<{ date: string; close: number }> = [];

  for (let i = 0; i < timestamps.length; i += 1) {
    const close = closes[i];
    if (typeof close === "number" && Number.isFinite(close)) {
      history.push({ date: formatDay(timestamps[i]), close });
    }
  }

  return {
    quote: {
      symbol,
      name: meta.shortName ?? meta.longName ?? symbol,
      price,
      changePercent: meta.regularMarketChangePercent ?? 0,
      currency: meta.currency ?? "USD",
    },
    closes: history,
  };
}

export function buildHistory(
  seriesBySymbol: Map<string, YahooSeries>,
): HistoryPoint[] {
  const calendars = OIL_MAJORS.map(
    (major) => seriesBySymbol.get(major.symbol)?.closes ?? [],
  );
  if (calendars.some((closes) => closes.length === 0)) {
    return fallbackHistory();
  }

  const wtiCloses = new Map(
    (seriesBySymbol.get(WTI_SYMBOL)?.closes ?? []).map((point) => [
      point.date,
      point.close,
    ]),
  );

  const dateSets = calendars.map((closes) => new Set(closes.map((c) => c.date)));
  const primaryDates = calendars[0].map((point) => point.date);
  const aligned = primaryDates.filter((date) =>
    dateSets.every((set) => set.has(date)),
  );

  const closeLookup = OIL_MAJORS.map((major) => {
    const closes = seriesBySymbol.get(major.symbol)?.closes ?? [];
    return new Map(closes.map((point) => [point.date, point.close]));
  });

  return aligned.map((date) => {
    const basket = OIL_MAJORS.reduce((sum, major, index) => {
      const close = closeLookup[index].get(date) ?? 0;
      return sum + major.weight * close;
    }, 0);
    return {
      date,
      gush: Number((basket / TOKEN.divisor).toFixed(4)),
      wti: wtiCloses.get(date) ?? null,
    };
  });
}

const CACHE_MS = 45_000;
let cached: { expires: number; snapshot: MarketSnapshot } | null = null;

export async function loadMarketSnapshot(): Promise<MarketSnapshot> {
  if (cached && cached.expires > Date.now()) {
    return cached.snapshot;
  }

  const symbols = [...OIL_MAJORS.map((major) => major.symbol), WTI_SYMBOL];
  const results = await Promise.allSettled(
    symbols.map((symbol) => fetchYahooSeries(symbol)),
  );

  const seriesBySymbol = new Map<string, YahooSeries>();
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      seriesBySymbol.set(symbols[index], result.value);
    }
  });

  const liveQuotes = OIL_MAJORS.map((major) =>
    seriesBySymbol.get(major.symbol)?.quote,
  ).filter((quote): quote is StockQuote => Boolean(quote));

  if (liveQuotes.length === OIL_MAJORS.length) {
    const wti = seriesBySymbol.get(WTI_SYMBOL)?.quote ?? null;
    if (wti) {
      wti.name = "WTI Crude";
    }
    const snapshot = snapshotFromQuotes(
      liveQuotes,
      wti,
      buildHistory(seriesBySymbol),
      "live",
    );
    cached = { expires: Date.now() + CACHE_MS, snapshot };
    return snapshot;
  }

  const snapshot = snapshotFromQuotes(
    FALLBACK_QUOTES,
    FALLBACK_WTI,
    fallbackHistory(),
    "fallback",
  );
  cached = { expires: Date.now() + CACHE_MS, snapshot };
  return snapshot;
}
