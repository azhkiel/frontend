// ============================================================
// AUTH HELPERS — Website Desa Kedungpari
// Simpan session di localStorage (client-only).
// ============================================================

import type { AuthSession, UserRole } from "./types";

const TOKEN_KEY = "desa_session_token";
const NAMA_KEY  = "desa_session_nama";
const ROLE_KEY  = "desa_session_role";

export function saveSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(NAMA_KEY,  session.nama);
  localStorage.setItem(ROLE_KEY,  session.role);
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const nama  = localStorage.getItem(NAMA_KEY);
  const role  = localStorage.getItem(ROLE_KEY) as UserRole | null;
  if (!token || !nama || !role) return null;
  return { token, nama, role };
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAMA_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}

export function isSuperAdmin(): boolean {
  return getSession()?.role === "superadmin";
}
