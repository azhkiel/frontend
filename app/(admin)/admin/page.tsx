"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import type { AuthSession } from "@/lib/types";

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/admin/login");
      return;
    }
    setSession(s);
  }, [router]);

  if (!session) return null;

  const menuCards = [
    { label: "Berita", href: "/admin/berita", icon: "📰", desc: "Kelola artikel & pengumuman desa" },
    { label: "Potensi", href: "/admin/potensi", icon: "⭐", desc: "Kelola UMKM, wisata & produk unggulan" },
    { label: "Galeri", href: "/admin/galeri", icon: "🖼️", desc: "Kelola foto & video kegiatan" },
    { label: "Struktur", href: "/admin/struktur", icon: "👥", desc: "Kelola perangkat desa" },
    { label: "Profil Desa", href: "/admin/profil", icon: "📄", desc: "Edit profil & visi misi desa" },
    { label: "Statistik", href: "/admin/statistik", icon: "📊", desc: "Edit data kependudukan" },
    ...(session.role === "superadmin"
      ? [{ label: "Pengguna", href: "/admin/users", icon: "🔑", desc: "Kelola akun admin" }]
      : []),
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">
          Selamat datang, <strong>{session.nama}</strong>. Pilih menu untuk mulai mengelola
          konten website desa.
        </p>
      </div>

      <div className="admin-dashboard-grid">
        {menuCards.map((card) => (
          <a
            key={card.href}
            href={card.href}
            className="admin-dashboard-card"
          >
            <span className="admin-dashboard-card-icon">{card.icon}</span>
            <h2 className="admin-dashboard-card-label">{card.label}</h2>
            <p className="admin-dashboard-card-desc">{card.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
