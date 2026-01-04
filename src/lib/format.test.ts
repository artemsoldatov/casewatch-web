import { describe, expect, it } from "vitest";
import { money, severityClass, shortHash, titleCase } from "./format";

describe("format", () => {
  it("formats cents as whole-dollar currency", () => {
    expect(money(500_000)).toBe("$5,000");
    expect(money(123_45)).toBe("$123");
  });

  it("shortens long hashes and leaves short ones", () => {
    expect(shortHash("0x1234567890abcdef")).toContain("…");
    expect(shortHash("0xabc")).toBe("0xabc");
  });

  it("maps each severity to a distinct class", () => {
    expect(severityClass("HIGH")).not.toBe(severityClass("MEDIUM"));
    expect(severityClass("LOW")).toContain("slate");
  });

  it("title-cases snake and space separated strings", () => {
    expect(titleCase("HIGH_RISK_JURISDICTION")).toBe("High Risk Jurisdiction");
    expect(titleCase("IN_REVIEW")).toBe("In Review");
  });
});
