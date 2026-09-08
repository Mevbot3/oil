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

const NICKNAMES: Record<string, string> = {
  XOM: "daddy",
  CVX: "the other daddy",
  COP: "conoco degen",
  SHEL: "shell yeah",
  BP: "british petroleum (real)",
  OXY: "permian gremlin",
};

export function PairTable({ rows }: { rows: BasketRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
        no oil daddies in the barrel. refresh the tape.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>oil daddy</TableHead>
          <TableHead className="text-right">bag</TableHead>
          <TableHead className="text-right">stock</TableHead>
          <TableHead className="text-right">today</TableHead>
          <TableHead className="text-right">$OIL juice</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const up = row.changePercent >= 0;
          return (
            <TableRow key={row.symbol}>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="font-heading text-base tracking-wide">
                    {row.symbol}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {NICKNAMES[row.symbol] ?? row.name}
                  </span>
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
