"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBeritaById, updateBerita } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import BeritaForm from "@/components/admin/BeritaForm";
import type { Berita } from "@/lib/types";

type BeritaFormData = Omit<Berita, "id">;

export default function EditBeritaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { session, isReady } = useAdminGuard();
  const [berita, setBerita] = useState<Berita | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    getBeritaById(id)
      .then((b) => {
        if (!b) setFetchError("Berita tidak ditemukan.");
        else setBerita(b);
      })
      .catch((err) => setFetchError(err instanceof Error ? err.message : "Gagal memuat data."))
      .finally(() => setIsFetching(false));
  }, [isReady, id]);

  if (!isReady || isFetching) return null;

  if (fetchError) {
    return (
      <div className="admin-page">
        <div className="admin-alert admin-alert--error">{fetchError}</div>
      </div>
    );
  }

  async function handleSubmit(data: BeritaFormData) {
    if (!session || !berita) return;
    setIsLoading(true);
    try {
      await updateBerita(session.token, { id: berita.id, ...data });
      router.push("/admin/berita");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Edit Berita</h1>
          <p className="admin-page-subtitle">Perbarui artikel: <em>{berita?.judul}</em></p>
        </div>
      </div>
      <BeritaForm
        initial={berita ?? undefined}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
