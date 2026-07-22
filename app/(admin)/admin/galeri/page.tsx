"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getGaleri, deleteGaleri } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { Galeri } from "@/lib/types";

export default function AdminGaleriPage() {
  const router = useRouter();
  const { session, isReady } = useAdminGuard();
  const [data, setData] = useState<Galeri[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Galeri | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true); setError(null);
    try { setData(await getGaleri()); }
    catch (err) { setError(err instanceof Error ? err.message : "Gagal memuat."); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { if (isReady) load(); }, [isReady, load]);

  async function handleDelete() {
    if (!deleteTarget || !session) return;
    setIsDeleting(true);
    try { await deleteGaleri(session.token, deleteTarget.id); setData((prev) => prev.filter((g) => g.id !== deleteTarget.id)); setDeleteTarget(null); }
    catch (err) { setError(err instanceof Error ? err.message : "Gagal menghapus."); }
    finally { setIsDeleting(false); }
  }

  if (!isReady) return null;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Galeri</h1><p className="admin-page-subtitle">Kelola foto dan video kegiatan desa.</p></div>
        <button onClick={() => router.push("/admin/galeri/tambah")} className="admin-btn admin-btn--primary" id="galeri-tambah-btn">+ Tambah Media</button>
      </div>
      {error && <div className="admin-alert admin-alert--error" role="alert">{error}</div>}
      <DataTable isLoading={isLoading} data={data} emptyMessage="Belum ada media di galeri."
        columns={[
          { key: "judul", label: "Judul" },
          { key: "tipe", label: "Tipe", render: (g) => <span className={`admin-badge admin-badge--${g.tipe}`}>{g.tipe}</span> },
          { key: "tanggal", label: "Tanggal" },
        ]}
        onEdit={(g) => router.push(`/admin/galeri/${g.id}/edit`)}
        onDelete={(g) => setDeleteTarget(g)}
      />
      <ConfirmDialog isOpen={!!deleteTarget} title="Hapus Media" message={`Yakin hapus "${deleteTarget?.judul}"?`} isLoading={isDeleting} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
