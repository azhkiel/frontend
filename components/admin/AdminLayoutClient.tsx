"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="admin-login-bg">{children}</div>;
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-content-wrap">
        <AdminHeader />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
