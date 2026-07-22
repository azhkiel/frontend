"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getStruktur, deleteStruktur } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { StrukturOrganisasi } from "@/lib/types";

export default function AdminStrukturPage() {
  const router = useRouter();
  const { session, isReady } = useAdminGuard();
  const [data, setData] = useState<StrukturOrganisasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StrukturOrganisasi | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true); setError(null);
    try { setData(await getStruktur()); }
    catch (err) { setError(err instanceof Error ? err.message : "Gagal memuat."); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { if (isReady) load(); }, [isReady, load]);

  async function handleDelete() {
    if (!deleteTarget || !session) return;
    setIsDeleting(true);
    try { await deleteStruktur(session.token, deleteTarget.id); setData((prev) => prev.filter((s) => s.id !== deleteTarget.id)); setDeleteTarget(null); }
    catch (err) { setError(err instanceof Error ? err.message : "Gagal menghapus."); }
    finally { setIsDeleting(false); }
  }

  if (!isReady) return null;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Struktur Organisasi</h1><p className="admin-page-subtitle">Kelola data perangkat desa.</p></div>
        <button onClick={() => router.push("/admin/struktur/tambah")} className="admin-btn admin-btn--primary" id="struktur-tambah-btn">+ Tambah Perangkat</button>
      </div>
      {error && <div className="admin-alert admin-alert--error" role="alert">{error}</div>}
      <DataTable isLoading={isLoading} data={data} emptyMessage="Belum ada data struktur."
        columns={[
          { key: "urutan", label: "#", render: (s) => <span className="font-mono text-sm">{s.urutan}</span> },
          { key: "nama", label: "Nama" },
          { key: "jabatan", label: "Jabatan" },
          { key: "noHp", label: "No. HP", render: (s) => s.noHp ?? "-" },
        ]}
        onEdit={(s) => router.push(`/admin/struktur/${s.id}/edit`)}
        onDelete={(s) => setDeleteTarget(s)}
      />
      <ConfirmDialog isOpen={!!deleteTarget} title="Hapus Perangkat" message={`Yakin hapus "${deleteTarget?.nama}"?`} isLoading={isDeleting} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
