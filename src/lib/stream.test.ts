import { describe, expect, it } from "vitest";
import { parseLines } from "./stream";

describe("parseLines", () => {
  it("parses complete NDJSON lines and keeps the trailing partial", () => {
    const buffer =
      '{"type":"status","message":"go"}\n{"type":"verdict","recommendation":"escalate"';
    const { events, rest } = parseLines(buffer);

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: "status", message: "go" });
    expect(rest).toContain("verdict");
  });

  it("returns no events when nothing is complete yet", () => {
    const { events, rest } = parseLines('{"type":"stat');
    expect(events).toHaveLength(0);
    expect(rest).toBe('{"type":"stat');
  });

  it("parses several events at once and ignores blank lines", () => {
    const buffer =
      '{"type":"factor","factor":{"rule":"A"}}\n\n{"type":"factor","factor":{"rule":"B"}}\n';
    const { events, rest } = parseLines(buffer);

    expect(events).toHaveLength(2);
    expect(rest).toBe("");
  });
});
