import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { listAlerts } from "@/lib/api";
import { AlertsTable } from "@/components/AlertsTable";

export default async function AlertsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const page = await listAlerts();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-lg font-semibold">Alert queue</h1>
          <p className="text-sm text-slate-500">
            {page.total} open case{page.total === 1 ? "" : "s"}, highest risk first
          </p>
        </div>
      </div>

      <AlertsTable alerts={page.data} />
    </div>
  );
}
