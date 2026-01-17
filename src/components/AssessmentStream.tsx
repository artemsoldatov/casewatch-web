"use client";

import { useEffect, useState } from "react";
import { readAssessmentStream, type StreamEvent } from "@/lib/stream";
import type { Finding } from "@/lib/types";
import { money, shortHash } from "@/lib/format";

export function AssessmentStream({ alertId }: { alertId: string }) {
  const [status, setStatus] = useState("Requesting analysis…");
  const [factors, setFactors] = useState<Finding[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    readAssessmentStream(
      alertId,
      (event: StreamEvent) => {
        if (event.type === "status") setStatus(event.message);
        if (event.type === "factor") setFactors((prev) => [...prev, event.factor]);
      },
      controller.signal,
    ).catch((err) => {
      if (!controller.signal.aborted) setFailed(true);
      void err;
    });

    return () => controller.abort();
  }, [alertId]);

  if (failed) {
    return <p className="text-sm text-red-600">Could not generate the assessment.</p>;
  }

  return (
    <div className="space-y-3" data-testid="assessment">
      <p className="animate-pulse text-sm text-slate-500" data-testid="assessment-status">
        {status}
      </p>

      {factors.map((f, i) => (
        <div key={`${f.rule}-${i}`} className="rounded-lg border border-slate-200 bg-white p-4" data-testid="factor-card">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{f.title}</h3>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium">+{f.weight}</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{f.detail}</p>
          {f.evidence.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-slate-500">
              {f.evidence.slice(0, 3).map((e) => (
                <li key={e.tx_hash} className="flex justify-between font-mono">
                  <span>{shortHash(e.tx_hash)}</span>
                  <span>{money(e.amount_cents)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
