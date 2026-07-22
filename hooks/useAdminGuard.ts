"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import type { AuthSession } from "@/lib/types";

/**
 * Hook guard admin — redirect ke login jika belum login.
 * Jika role required dan tidak cocok, redirect ke /admin.
 */
export function useAdminGuard(requiredRole?: "superadmin"): {
  session: AuthSession | null;
  isReady: boolean;
} {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/admin/login");
      return;
    }
    if (requiredRole && s.role !== requiredRole) {
      router.replace("/admin");
      return;
    }
    setSession(s);
    setIsReady(true);
  }, [router, requiredRole]);

  return { session, isReady };
}
