"use client";

import { useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import type { HistoryPoint } from "@/lib/basket";
import { formatUsd } from "@/lib/format";

const chartConfig = {
  oil: { label: "$OIL", color: "#E8B84A" },
  wti: { label: "WTI", color: "#7C9A6A" },
} satisfies ChartConfig;

type RangeKey = "1M" | "3M";

function inRange(date: string, range: RangeKey): boolean {
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - (range === "1M" ? 31 : 93));
  return date >= start.toISOString().slice(0, 10);
}

export function GushChart({ history }: { history: HistoryPoint[] }) {
  const [range, setRange] = useState<RangeKey>("3M");

  const data = useMemo(
    () => history.filter((point) => inRange(point.date, range)),
    [history, range],
  );

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
        chart still in the ground. come back after the next close.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          $OIL rebuilt every session from the oil daddies&apos; close.
        </p>
        <div className="flex gap-1">
          {(["1M", "3M"] as const).map((key) => (
            <Button
              key={key}
              size="sm"
              variant={range === key ? "default" : "outline"}
              onClick={() => setRange(key)}
            >
              {key}
            </Button>
          ))}
        </div>
      </div>
      <ChartContainer config={chartConfig} className="aspect-[16/8] w-full">
        <ComposedChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            minTickGap={28}
            tickFormatter={(value: string) =>
              new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(value: number) => formatUsd(value, true)}
          />
          <YAxis
            yAxisId="wti"
            orientation="right"
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(value: number) => `$${value.toFixed(0)}`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) =>
                  typeof value === "string"
                    ? new Date(`${value}T00:00:00Z`).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )
                    : String(value ?? "")
                }
                formatter={(value, name) => {
                  const amount =
                    typeof value === "number" ? value : Number(value);
                  if (name === "wti") {
                    return (
                      <span className="font-mono">
                        WTI {Number.isFinite(amount) ? formatUsd(amount) : "—"}
                      </span>
                    );
                  }
                  return (
                    <span className="font-mono">
                      $OIL{" "}
                      {Number.isFinite(amount) ? formatUsd(amount, true) : "—"}
                    </span>
                  );
                }}
              />
            }
          />
          <Area
            dataKey="oil"
            type="monotone"
            stroke="var(--color-oil)"
            fill="var(--color-oil)"
            fillOpacity={0.18}
            strokeWidth={2}
          />
          <Line
            dataKey="wti"
            type="monotone"
            stroke="var(--color-wti)"
            strokeWidth={1.5}
            dot={false}
            yAxisId="wti"
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
