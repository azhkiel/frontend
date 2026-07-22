"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPotensiById, updatePotensi } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import PotensiForm from "@/components/admin/PotensiForm";
import type { Potensi } from "@/lib/types";

type PotensiFormData = Omit<Potensi, "id">;

export default function EditPotensiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { session, isReady } = useAdminGuard();
  const [potensi, setPotensi] = useState<Potensi | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    getPotensiById(id)
      .then((p) => { if (!p) setFetchError("Data tidak ditemukan."); else setPotensi(p); })
      .catch((err) => setFetchError(err instanceof Error ? err.message : "Gagal memuat."))
      .finally(() => setIsFetching(false));
  }, [isReady, id]);

  if (!isReady || isFetching) return null;
  if (fetchError) return <div className="admin-page"><div className="admin-alert admin-alert--error">{fetchError}</div></div>;

  async function handleSubmit(data: PotensiFormData) {
    if (!session || !potensi) return;
    setIsLoading(true);
    try { await updatePotensi(session.token, { id: potensi.id, ...data }); router.push("/admin/potensi"); }
    finally { setIsLoading(false); }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Edit Potensi</h1><p className="admin-page-subtitle"><em>{potensi?.nama}</em></p></div>
      </div>
      <PotensiForm initial={potensi ?? undefined} onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Simpan Perubahan" />
    </div>
  );
}
