// Minimal fixture API for Playwright. The Next server-side fetches hit this
// instead of the real Laravel backend, so e2e runs offline and deterministic.
import { createServer } from "node:http";

const PORT = 53250;

const counterparties = {
  "cp-high": { id: "cp-high", external_ref: "layer-01", country: "US", kind: "entity", chain: "ethereum" },
  "cp-med": { id: "cp-med", external_ref: "smurf-01", country: "US", kind: "entity", chain: "ethereum" },
};

const findings = [
  {
    rule: "RAPID_MOVEMENT",
    title: "Rapid in-and-out movement",
    detail: "Funds moved out within 24h of arriving, ~85% passed through",
    weight: 35,
    evidence: [{ tx_hash: "0xrapid0000000000abcd", amount_cents: 2_000_000, chain: "ethereum", occurred_at: "2025-12-02T02:00:00+00:00" }],
  },
  {
    rule: "LAYERING",
    title: "Intermediary layering",
    detail: "Funds fan in from 3 sources and out to 3 destinations",
    weight: 40,
    evidence: [{ tx_hash: "0xlayer0000000000ef01", amount_cents: 1_700_000, chain: "ethereum", occurred_at: "2025-12-02T03:00:00+00:00" }],
  },
];

const alerts = {
  "a-high": {
    id: "a-high",
    organization_id: "org-1",
    counterparty_id: "cp-high",
    type: "LAYERING",
    severity: "HIGH",
    score: 75,
    status: "OPEN",
    assigned_to: null,
    rationale: findings,
    created_at: "2025-12-03T10:00:00Z",
    counterparty: counterparties["cp-high"],
  },
  "a-med": {
    id: "a-med",
    organization_id: "org-1",
    counterparty_id: "cp-med",
    type: "STRUCTURING",
    severity: "MEDIUM",
    score: 45,
    status: "OPEN",
    assigned_to: null,
    rationale: [],
    created_at: "2025-12-03T09:00:00Z",
    counterparty: counterparties["cp-med"],
  },
};

const json = (res, code, body) => {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
};

const readBody = (req) =>
  new Promise((resolve) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => resolve(raw ? JSON.parse(raw) : {}));
  });

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const path = url.pathname;
  const method = req.method;

  if (method === "POST" && path === "/api/auth/login") {
    const body = await readBody(req);
    if (body.password !== "password") return json(res, 422, { message: "bad" });
    const role = String(body.email).startsWith("lead") ? "lead" : "analyst";
    return json(res, 200, { token: "test-token", user: { name: role === "lead" ? "Dana Lead" : "Alex Analyst", role } });
  }

  if (method === "POST" && path === "/api/auth/logout") return json(res, 200, { ok: true });

  if (method === "GET" && path === "/api/alerts") {
    const data = Object.values(alerts);
    return json(res, 200, { data, total: data.length, current_page: 1, last_page: 1 });
  }

  const m = path.match(/^\/api\/alerts\/([^/]+)(\/[a-z]+)?$/);
  if (m) {
    const alert = alerts[m[1]];
    if (!alert) return json(res, 404, { message: "not found" });
    const sub = m[2];

    if (method === "GET" && !sub) {
      return json(res, 200, {
        alert,
        audit: [{ id: "e1", action: "alert.opened", actor_id: null, meta: { type: alert.type }, created_at: alert.created_at }],
      });
    }
    if (method === "GET" && sub === "/assessment") {
      return json(res, 200, {
        score: alert.score,
        severity: alert.severity,
        recommendation: alert.score >= 70 ? "escalate" : "review",
        summary: `Score ${alert.score}/100 (${alert.severity}).`,
        factors: alert.rationale,
      });
    }
    if (method === "GET" && sub === "/transactions") {
      return json(res, 200, {
        data: [
          { id: "t1", direction: "in", chain: "ethereum", tx_hash: "0xin000000000000aaaa", amount_cents: 2_000_000, currency: "USD", occurred_at: "2025-12-02T00:00:00+00:00" },
          { id: "t2", direction: "out", chain: "ethereum", tx_hash: "0xout00000000000bbbb", amount_cents: 1_700_000, currency: "USD", occurred_at: "2025-12-02T03:00:00+00:00" },
        ],
      });
    }
    if (method === "GET" && sub === "/sar") {
      return json(res, 200, {
        subject: { counterparty_id: alert.counterparty_id, name: "Mesh Intermediary", country: alert.counterparty.country, wallet: "0xabc" },
        alert: { type: alert.type, severity: alert.severity, score: alert.score },
        narrative: "Automated monitoring flagged the following activity:\n- layering",
        disclaimer: "Draft for analyst review — not filed automatically.",
      });
    }
    if (method === "POST" && sub === "/disposition") {
      const body = await readBody(req);
      if ((body.action === "clear" || body.action === "escalate")) {
        return json(res, 200, { alert: { ...alert, status: body.action === "clear" ? "CLEARED" : "ESCALATED" } });
      }
      if (body.action === "assign" && !body.assignee) return json(res, 422, { message: "assignee required" });
      return json(res, 200, { alert: { ...alert, status: "IN_REVIEW", assigned_to: body.assignee } });
    }
  }

  json(res, 404, { message: "unhandled" });
});

server.listen(PORT, () => console.log(`mock-api on :${PORT}`));
