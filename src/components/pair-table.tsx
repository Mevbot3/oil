import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BasketRow } from "@/lib/basket";
import { formatPercent, formatUsd, formatWeight } from "@/lib/format";

export function PairTable({ rows }: { rows: BasketRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
        No oil majors in the barrel. Check the field report.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Stock</TableHead>
          <TableHead className="text-right">Weight</TableHead>
          <TableHead className="text-right">Share price</TableHead>
          <TableHead className="text-right">Day</TableHead>
          <TableHead className="text-right">$GUSH slice</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const up = row.changePercent >= 0;
          return (
            <TableRow key={row.symbol}>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono font-semibold">{row.symbol}</span>
                  <span className="text-xs text-muted-foreground">{row.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatWeight(row.weight)}
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatUsd(row.price)}
              </TableCell>
              <TableCell className="text-right">
                <Badge
                  variant="outline"
                  className={
                    up
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/30 bg-red-500/10 text-red-300"
                  }
                >
                  {formatPercent(row.changePercent)}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono text-amber-200">
                {formatUsd(row.contribution, true)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
