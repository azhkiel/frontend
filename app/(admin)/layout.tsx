import type { Metadata } from "next";
import "../globals.css";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";


export const metadata: Metadata = {
  title: {
    default: "Admin — Desa Kedungpari",
    template: "%s | Admin Desa",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </body>
    </html>
  );
}
