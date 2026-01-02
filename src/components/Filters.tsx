"use client";

import { useRouter } from "next/navigation";

const STATUSES = ["", "OPEN", "IN_REVIEW", "ESCALATED", "CLEARED"];
const SEVERITIES = ["", "HIGH", "MEDIUM", "LOW"];

export function Filters({ status, severity }: { status?: string; severity?: string }) {
  const router = useRouter();

  function apply(next: { status?: string; severity?: string }) {
    const qs = new URLSearchParams();
    const s = next.status ?? status;
    const sev = next.severity ?? severity;
    if (s) qs.set("status", s);
    if (sev) qs.set("severity", sev);
    router.push(qs.toString() ? `/alerts?${qs}` : "/alerts");
  }

  const select = "rounded border border-slate-300 bg-white px-2 py-1.5 text-sm";

  return (
    <div className="flex gap-2">
      <select
        aria-label="Filter by severity"
        value={severity ?? ""}
        onChange={(e) => apply({ severity: e.target.value })}
        className={select}
      >
        {SEVERITIES.map((v) => (
          <option key={v} value={v}>
            {v || "All severities"}
          </option>
        ))}
      </select>
      <select
        aria-label="Filter by status"
        value={status ?? ""}
        onChange={(e) => apply({ status: e.target.value })}
        className={select}
      >
        {STATUSES.map((v) => (
          <option key={v} value={v}>
            {v ? v.replace("_", " ") : "All statuses"}
          </option>
        ))}
      </select>
    </div>
  );
}
