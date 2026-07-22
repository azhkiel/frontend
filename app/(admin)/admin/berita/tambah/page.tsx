"use client";

import { useRouter } from "next/navigation";
import { createBerita } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import BeritaForm from "@/components/admin/BeritaForm";
import type { Berita } from "@/lib/types";
import { useState } from "react";

type BeritaFormData = Omit<Berita, "id">;

export default function TambahBeritaPage() {
  const router = useRouter();
  const { session, isReady } = useAdminGuard();
  const [isLoading, setIsLoading] = useState(false);

  if (!isReady) return null;

  async function handleSubmit(data: BeritaFormData) {
    if (!session) return;
    setIsLoading(true);
    try {
      await createBerita(session.token, data);
      router.push("/admin/berita");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tambah Berita</h1>
          <p className="admin-page-subtitle">Buat artikel atau pengumuman baru.</p>
        </div>
      </div>
      <BeritaForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Tambah Berita" />
    </div>
  );
}
