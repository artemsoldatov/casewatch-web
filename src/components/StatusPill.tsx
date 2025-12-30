import { titleCase } from "@/lib/format";
import type { AlertStatus } from "@/lib/types";

const CLASS: Record<AlertStatus, string> = {
  OPEN: "bg-blue-50 text-blue-700",
  IN_REVIEW: "bg-violet-50 text-violet-700",
  ESCALATED: "bg-red-50 text-red-700",
  CLEARED: "bg-emerald-50 text-emerald-700",
};

export function StatusPill({ status }: { status: AlertStatus }) {
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${CLASS[status] ?? CLASS.OPEN}`}>
      {titleCase(status)}
    </span>
  );
}
