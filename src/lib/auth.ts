import { cookies } from "next/headers";
import type { Role } from "./types";

const TOKEN = "cw_token";
const ROLE = "cw_role";
const NAME = "cw_name";

export interface Session {
  token: string;
  role: Role;
  name: string;
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(TOKEN)?.value;
  if (!token) return null;
  const role = (jar.get(ROLE)?.value as Role) ?? "analyst";
  const name = jar.get(NAME)?.value ?? "Analyst";
  return { token, role, name };
}

export async function setSession(session: Session): Promise<void> {
  const jar = await cookies();
  const opts = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 8,
  };
  jar.set(TOKEN, session.token, opts);
  jar.set(ROLE, session.role, opts);
  jar.set(NAME, session.name, opts);
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(TOKEN);
  jar.delete(ROLE);
  jar.delete(NAME);
}
