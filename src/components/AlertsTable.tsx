import Link from "next/link";
import { titleCase, when } from "@/lib/format";
import type { Alert } from "@/lib/types";
import { SeverityBadge } from "./SeverityBadge";
import { StatusPill } from "./StatusPill";

export function AlertsTable({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) {
    return (
      <p className="rounded border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        No alerts match the current filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Counterparty</th>
            <th className="px-4 py-3 font-medium">Severity</th>
            <th className="px-4 py-3 font-medium">Score</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Opened</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {alerts.map((a) => (
            <tr key={a.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <Link href={`/alerts/${a.id}`} className="font-medium text-slate-900 hover:underline">
                  {titleCase(a.type)}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {a.counterparty?.external_ref ?? "—"}
                <span className="ml-2 text-xs text-slate-400">{a.counterparty?.country}</span>
              </td>
              <td className="px-4 py-3">
                <SeverityBadge severity={a.severity} />
              </td>
              <td className="px-4 py-3 font-mono">{a.score}</td>
              <td className="px-4 py-3">
                <StatusPill status={a.status} />
              </td>
              <td className="px-4 py-3 text-slate-500">{when(a.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
