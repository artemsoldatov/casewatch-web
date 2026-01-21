import type { SarDraft as SarDraftType } from "@/lib/types";

export function SarDraft({ sar }: { sar: SarDraftType }) {
  return (
    <details className="rounded border border-slate-200 bg-white p-3 text-sm">
      <summary className="cursor-pointer font-medium">SAR draft</summary>
      <dl className="mt-3 space-y-1 text-slate-600">
        <div className="flex justify-between">
          <dt className="text-slate-400">Subject</dt>
          <dd>{sar.subject.name ?? sar.subject.counterparty_id}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Country</dt>
          <dd>{sar.subject.country ?? "—"}</dd>
        </div>
      </dl>
      <pre className="mt-3 whitespace-pre-wrap rounded bg-slate-50 p-3 text-xs text-slate-700">
        {sar.narrative}
      </pre>
      <p className="mt-2 text-xs italic text-slate-400">{sar.disclaimer}</p>
    </details>
  );
}
