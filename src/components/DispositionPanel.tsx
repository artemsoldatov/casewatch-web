"use client";

import { useActionState } from "react";
import { dispositionAction, type DispositionState } from "@/lib/alert-actions";

const initial: DispositionState = {};

export function DispositionPanel({ alertId }: { alertId: string }) {
  const [state, action, pending] = useActionState(dispositionAction, initial);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={alertId} />

      <div>
        <label htmlFor="assignee" className="block text-xs font-medium text-slate-500">
          Assignee
        </label>
        <input
          id="assignee"
          name="assignee"
          placeholder="analyst handle"
          className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div>
        <label htmlFor="note" className="block text-xs font-medium text-slate-500">
          Note
        </label>
        <textarea
          id="note"
          name="note"
          rows={2}
          placeholder="rationale for the record"
          className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.ok && <p className="text-sm text-emerald-600">Saved.</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          name="action"
          value="assign"
          disabled={pending}
          className="rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          Assign
        </button>
      </div>
    </form>
  );
}
