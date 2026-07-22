"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getPotensi, deletePotensi } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { Potensi } from "@/lib/types";

export default function AdminPotensiPage() {
  const router = useRouter();
  const { session, isReady } = useAdminGuard();
  const [data, setData] = useState<Potensi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Potensi | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try { setData(await getPotensi()); }
    catch (err) { setError(err instanceof Error ? err.message : "Gagal memuat data."); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { if (isReady) load(); }, [isReady, load]);

  async function handleDelete() {
    if (!deleteTarget || !session) return;
    setIsDeleting(true);
    try {
      await deletePotensi(session.token, deleteTarget.id);
      setData((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) { setError(err instanceof Error ? err.message : "Gagal menghapus."); }
    finally { setIsDeleting(false); }
  }

  if (!isReady) return null;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Potensi Desa</h1>
          <p className="admin-page-subtitle">Kelola UMKM, wisata, dan produk unggulan.</p>
        </div>
        <button onClick={() => router.push("/admin/potensi/tambah")} className="admin-btn admin-btn--primary" id="potensi-tambah-btn">
          + Tambah Potensi
        </button>
      </div>
      {error && <div className="admin-alert admin-alert--error" role="alert">{error}</div>}
      <DataTable
        isLoading={isLoading} data={data} emptyMessage="Belum ada data potensi."
        columns={[
          { key: "nama", label: "Nama" },
          { key: "kategori", label: "Kategori" },
          { key: "lokasi", label: "Lokasi" },
          { key: "kontak", label: "Kontak", render: (p) => p.kontak ?? "-" },
        ]}
        onEdit={(p) => router.push(`/admin/potensi/${p.id}/edit`)}
        onDelete={(p) => setDeleteTarget(p)}
      />
      <ConfirmDialog isOpen={!!deleteTarget} title="Hapus Potensi" message={`Yakin hapus potensi "${deleteTarget?.nama}"?`} isLoading={isDeleting} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
