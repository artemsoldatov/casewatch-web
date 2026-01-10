import "server-only";
import { getSession } from "./auth";
import type { Alert, AuditEvent, Paginated, Role, TimelineTx } from "./types";


const BASE = process.env.API_URL ?? "http://127.0.0.1:8000/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, `API ${res.status} on ${path}`);
  }
  return res.json() as Promise<T>;
}

async function authed<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = await getSession();
  if (!session) throw new ApiError(401, "Not authenticated");
  return request<T>(path, {
    ...init,
    headers: { ...(init.headers ?? {}), Authorization: `Bearer ${session.token}` },
  });
}

export async function login(
  email: string,
  password: string,
): Promise<{ token: string; user: { name: string; role: Role } }> {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export interface AlertFilters {
  status?: string;
  severity?: string;
}

export async function listAlerts(filters: AlertFilters = {}): Promise<Paginated<Alert>> {
  const qs = new URLSearchParams();
  if (filters.status) qs.set("status", filters.status);
  if (filters.severity) qs.set("severity", filters.severity);
  const suffix = qs.toString() ? `?${qs}` : "";
  return authed(`/alerts${suffix}`);
}

export async function getAlert(id: string): Promise<{ alert: Alert; audit: AuditEvent[] }> {
  return authed(`/alerts/${id}`);
}

export async function getTransactions(id: string): Promise<TimelineTx[]> {
  const res = await authed<{ data: TimelineTx[] }>(`/alerts/${id}/transactions`);
  return res.data;
}
