"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getBerita, deleteBerita } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { Berita } from "@/lib/types";

export default function AdminBeritaPage() {
  const router = useRouter();
  const { session, isReady } = useAdminGuard();
  const [data, setData] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Berita | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getBerita({ sortBy: "tanggal" });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isReady) load();
  }, [isReady, load]);

  async function handleDelete() {
    if (!deleteTarget || !session) return;
    setIsDeleting(true);
    try {
      await deleteBerita(session.token, deleteTarget.id);
      setData((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (!isReady) return null;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Berita</h1>
          <p className="admin-page-subtitle">Kelola artikel, pengumuman, dan kegiatan desa.</p>
        </div>
        <button
          onClick={() => router.push("/admin/berita/tambah")}
          className="admin-btn admin-btn--primary"
          id="berita-tambah-btn"
        >
          + Tambah Berita
        </button>
      </div>

      {error && (
        <div className="admin-alert admin-alert--error" role="alert">
          {error}
        </div>
      )}

      <DataTable
        isLoading={isLoading}
        data={data}
        emptyMessage="Belum ada berita. Klik tombol 'Tambah Berita' untuk mulai."
        columns={[
          { key: "judul", label: "Judul" },
          { key: "kategori", label: "Kategori", render: (b) => (
            <span className={`admin-badge admin-badge--${b.kategori.toLowerCase()}`}>
              {b.kategori}
            </span>
          )},
          { key: "tanggal", label: "Tanggal" },
          { key: "penulis", label: "Penulis" },
        ]}
        onEdit={(b) => router.push(`/admin/berita/${b.id}/edit`)}
        onDelete={(b) => setDeleteTarget(b)}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Berita"
        message={`Yakin ingin menghapus berita "${deleteTarget?.judul}"? Tindakan ini tidak dapat dibatalkan.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
