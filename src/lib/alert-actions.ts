"use server";

import { revalidatePath } from "next/cache";
import { disposition, ApiError } from "./api";

export interface DispositionState {
  ok?: boolean;
  error?: string;
}

export async function dispositionAction(
  _prev: DispositionState,
  formData: FormData,
): Promise<DispositionState> {
  const id = String(formData.get("id") ?? "");
  const action = String(formData.get("action") ?? "");
  const note = String(formData.get("note") ?? "");
  const assignee = String(formData.get("assignee") ?? "");

  try {
    await disposition(id, {
      action,
      note: note || undefined,
      assignee: assignee || undefined,
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      return { error: "Only leads can clear or escalate a case." };
    }
    if (err instanceof ApiError && err.status === 422) {
      return { error: "This action needs an assignee." };
    }
    return { error: "Could not apply the disposition." };
  }

  revalidatePath(`/alerts/${id}`);
  revalidatePath("/alerts");
  return { ok: true };
}
