import { money, shortHash, when } from "@/lib/format";
import type { TimelineTx } from "@/lib/types";

export function TransactionTimeline({ transactions }: { transactions: TimelineTx[] }) {
  if (transactions.length === 0) {
    return <p className="text-sm text-slate-500">No transactions on record.</p>;
  }

  return (
    <ol className="space-y-2">
      {transactions.map((t) => {
        const inbound = t.direction === "in";
        return (
          <li key={t.id} className="flex items-center gap-3 rounded border border-slate-200 bg-white px-3 py-2 text-sm">
            <span
              className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                inbound ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
              }`}
              title={inbound ? "Inbound" : "Outbound"}
            >
              {inbound ? "↓" : "↑"}
            </span>
            <span className="font-mono text-xs text-slate-500">{shortHash(t.tx_hash)}</span>
            <span className="ml-auto font-medium">{money(t.amount_cents, t.currency)}</span>
            <span className="w-40 text-right text-xs text-slate-400">{when(t.occurred_at)}</span>
          </li>
        );
      })}
    </ol>
  );
}
