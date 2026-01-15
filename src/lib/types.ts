export type Severity = "LOW" | "MEDIUM" | "HIGH";
export type AlertStatus = "OPEN" | "IN_REVIEW" | "ESCALATED" | "CLEARED";
export type Role = "analyst" | "lead";

export interface Counterparty {
  id: string;
  external_ref: string;
  country: string;
  kind: string;
  chain: string;
  name?: string;
  wallet_address?: string;
}

export interface Finding {
  rule: string;
  title: string;
  detail: string;
  weight: number;
  evidence: Array<{
    tx_hash: string;
    amount_cents: number;
    chain: string;
    occurred_at: string;
  }>;
}

export interface Alert {
  id: string;
  organization_id: string;
  counterparty_id: string;
  type: string;
  severity: Severity;
  score: number;
  status: AlertStatus;
  assigned_to: string | null;
  rationale: Finding[];
  created_at: string;
  counterparty?: Counterparty;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
}

export interface TimelineTx {
  id: string;
  direction: "in" | "out";
  chain: string;
  tx_hash: string;
  amount_cents: number;
  currency: string;
  occurred_at: string;
}

export interface AuditEvent {
  id: string;
  action: string;
  actor_id: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
}

export interface Assessment {
  score: number;
  severity: Severity;
  recommendation: "escalate" | "review" | "monitor";
  summary: string;
  factors: Finding[];
}
