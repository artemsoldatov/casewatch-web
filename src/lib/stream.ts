import type { Finding, Severity } from "./types";

export type StreamEvent =
  | { type: "status"; message: string }
  | { type: "factor"; factor: Finding }
  | {
      type: "verdict";
      recommendation: "escalate" | "review" | "monitor";
      summary: string;
      score: number;
      severity: Severity;
    };

/**
 * Splits a growing NDJSON buffer into parsed events plus the trailing partial
 * line still being received. Kept pure so it can be unit-tested without a
 * network stream.
 */
export function parseLines(buffer: string): { events: StreamEvent[]; rest: string } {
  const parts = buffer.split("\n");
  const rest = parts.pop() ?? "";
  const events: StreamEvent[] = [];
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed) events.push(JSON.parse(trimmed) as StreamEvent);
  }
  return { events, rest };
}

export async function readAssessmentStream(
  id: string,
  onEvent: (event: StreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`/api/assessment/${id}`, { signal });
  if (!res.ok || !res.body) throw new Error(`stream failed: ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const { events, rest } = parseLines(buffer);
    buffer = rest;
    for (const event of events) onEvent(event);
  }

  const { events } = parseLines(buffer + "\n");
  for (const event of events) onEvent(event);
}
