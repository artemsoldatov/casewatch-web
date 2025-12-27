"use client";

import { logoutAction } from "@/lib/auth-actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="text-slate-500 hover:text-slate-900">
        Sign out
      </button>
    </form>
  );
}
