import { titleCase, when } from "@/lib/format";
import type { AuditEvent } from "@/lib/types";

export function AuditTrail({ events }: { events: AuditEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-slate-500">No activity yet.</p>;
  }

  return (
    <ul className="space-y-2 text-sm">
      {events.map((e) => {
        const note = typeof e.meta?.note === "string" ? e.meta.note : null;
        return (
          <li key={e.id} className="border-l-2 border-slate-200 pl-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{titleCase(e.action.replace(/^alert\./, ""))}</span>
              <span className="text-xs text-slate-400">{when(e.created_at)}</span>
            </div>
            {note && <p className="text-xs text-slate-500">“{note}”</p>}
          </li>
        );
      })}
    </ul>
  );
}
