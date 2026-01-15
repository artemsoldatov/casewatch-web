import { getAssessment } from "@/lib/api";
import { ApiError } from "@/lib/api";

export const dynamic = "force-dynamic";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Streams the assessment as it is "generated": a status line, then one card
// per risk factor. Deterministic and offline — a real LLM provider would
// drop in here without changing the client.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let assessment;
  try {
    assessment = await getAssessment(id);
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    return new Response(JSON.stringify({ error: "assessment_failed" }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const line = (obj: unknown) => encoder.encode(JSON.stringify(obj) + "\n");

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        line({
          type: "status",
          message: `Analyzing ${assessment.factors.length} risk factor${
            assessment.factors.length === 1 ? "" : "s"
          }…`,
        }),
      );
      await sleep(250);

      for (const factor of assessment.factors) {
        controller.enqueue(line({ type: "factor", factor }));
        await sleep(350);
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
