"use server";

import { redirect } from "next/navigation";
import { login } from "./api";
import { clearSession, setSession } from "./auth";
import { ApiError } from "./api";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const { token, user } = await login(email, password);
    await setSession({ token, role: user.role, name: user.name });
  } catch (err) {
    if (err instanceof ApiError && err.status === 422) {
      return { error: "Invalid email or password." };
    }
    return { error: "Could not reach the service. Is the API running?" };
  }

  redirect("/alerts");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}
