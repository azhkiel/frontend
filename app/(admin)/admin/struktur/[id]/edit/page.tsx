"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStrukturById, updateStruktur } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import StrukturForm from "@/components/admin/StrukturForm";
import type { StrukturOrganisasi } from "@/lib/types";

type StrukturFormData = Omit<StrukturOrganisasi, "id">;

export default function EditStrukturPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { session, isReady } = useAdminGuard();
  const [struktur, setStruktur] = useState<StrukturOrganisasi | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    getStrukturById(id).then((s) => { if (!s) setFetchError("Data tidak ditemukan."); else setStruktur(s); })
      .catch((err) => setFetchError(err instanceof Error ? err.message : "Gagal memuat."))
      .finally(() => setIsFetching(false));
  }, [isReady, id]);

  if (!isReady || isFetching) return null;
  if (fetchError) return <div className="admin-page"><div className="admin-alert admin-alert--error">{fetchError}</div></div>;

  async function handleSubmit(data: StrukturFormData) {
    if (!session || !struktur) return;
    setIsLoading(true);
    try { await updateStruktur(session.token, { id: struktur.id, ...data }); router.push("/admin/struktur"); }
    finally { setIsLoading(false); }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header"><div><h1 className="admin-page-title">Edit Perangkat</h1><p className="admin-page-subtitle"><em>{struktur?.nama}</em></p></div></div>
      <StrukturForm initial={struktur ?? undefined} onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Simpan Perubahan" />
    </div>
  );
}
