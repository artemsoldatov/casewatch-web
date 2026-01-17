import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAlert, getTransactions, ApiError } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { titleCase } from "@/lib/format";
import { AssessmentStream } from "@/components/AssessmentStream";
import { AuditTrail } from "@/components/AuditTrail";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusPill } from "@/components/StatusPill";
import { TransactionTimeline } from "@/components/TransactionTimeline";

export default async function AlertDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  let data;
  try {
    data = await getAlert(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const transactions = await getTransactions(id);
  const { alert, audit } = data;
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Risk assessment">
            <AssessmentStream alertId={alert.id} />
          </Section>

          <Section title={`Transactions (${transactions.length})`}>
            <TransactionTimeline transactions={transactions} />
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Audit trail">
            <AuditTrail events={audit} />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      {children}
    </section>
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
