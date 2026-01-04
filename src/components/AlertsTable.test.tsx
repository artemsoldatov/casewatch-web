import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AlertsTable } from "./AlertsTable";
import type { Alert } from "@/lib/types";

const alert: Alert = {
  id: "a1",
  organization_id: "o1",
  counterparty_id: "c1",
  type: "HIGH_RISK_JURISDICTION",
  severity: "HIGH",
  score: 75,
  status: "OPEN",
  assigned_to: null,
  rationale: [],
  created_at: "2025-12-03T10:00:00Z",
  counterparty: { id: "c1", external_ref: "hrj-01", country: "IR", kind: "entity", chain: "bitcoin" },
};

describe("AlertsTable", () => {
  it("renders a row with humanised type, score and counterparty", () => {
    render(<AlertsTable alerts={[alert]} />);

    expect(screen.getByRole("link", { name: "High Risk Jurisdiction" })).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
    expect(screen.getByText("hrj-01")).toBeInTheDocument();
    expect(screen.getByText("HIGH")).toBeInTheDocument();
  });

  it("shows an empty state when there are no alerts", () => {
    render(<AlertsTable alerts={[]} />);
    expect(screen.getByText(/no alerts match/i)).toBeInTheDocument();
  });
});
