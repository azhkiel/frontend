"use client";

import { useRouter } from "next/navigation";
import { clearSession, getSession } from "@/lib/auth";
import { logout } from "@/lib/api";
import { useState } from "react";

export default function AdminHeader() {
  const router = useRouter();
  const session = getSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (!session) return;
    setIsLoggingOut(true);
    try {
      await logout(session.token);
    } catch {
      // Tetap lanjutkan logout meski API error
    } finally {
      clearSession();
      router.push("/admin/login");
    }
  }

  return (
    <header className="admin-header">
      <div className="admin-header-inner">
        <div className="admin-header-user">
          <div className="admin-avatar">
            {session?.nama?.charAt(0).toUpperCase() ?? "A"}
          </div>
          <div className="admin-header-info">
            <p className="admin-header-name">{session?.nama ?? "Admin"}</p>
            <span className={`admin-role-badge admin-role-badge--${session?.role ?? "admin"}`}>
              {session?.role === "superadmin" ? "Super Admin" : "Admin"}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="admin-logout-btn"
          aria-label="Keluar dari panel admin"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          {isLoggingOut ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </header>
  );
}
