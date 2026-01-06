import Link from "next/link";
import { redirect } from "next/navigation";
import { getAlert } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { titleCase } from "@/lib/format";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusPill } from "@/components/StatusPill";

export default async function AlertDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const { alert } = await getAlert(id);
  const cp = alert.counterparty;

  return (
    <div className="space-y-6">
      <Link href="/alerts" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to queue
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-semibold">{titleCase(alert.type)}</h1>
        <SeverityBadge severity={alert.severity} />
        <StatusPill status={alert.status} />
        <span className="font-mono text-sm text-slate-500">score {alert.score}</span>
      </div>

      {cp && (
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 text-sm sm:grid-cols-4">
          <Field label="Counterparty" value={cp.external_ref} />
          <Field label="Kind" value={titleCase(cp.kind)} />
          <Field label="Country" value={cp.country} />
          <Field label="Chain" value={cp.chain} />
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
