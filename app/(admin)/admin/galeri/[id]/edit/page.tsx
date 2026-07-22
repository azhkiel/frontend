"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getGaleriById, updateGaleri } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import GaleriForm from "@/components/admin/GaleriForm";
import type { Galeri } from "@/lib/types";

type GaleriFormData = Omit<Galeri, "id">;

export default function EditGaleriPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { session, isReady } = useAdminGuard();
  const [galeri, setGaleri] = useState<Galeri | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    getGaleriById(id).then((g) => { if (!g) setFetchError("Data tidak ditemukan."); else setGaleri(g); })
      .catch((err) => setFetchError(err instanceof Error ? err.message : "Gagal memuat."))
      .finally(() => setIsFetching(false));
  }, [isReady, id]);

  if (!isReady || isFetching) return null;
  if (fetchError) return <div className="admin-page"><div className="admin-alert admin-alert--error">{fetchError}</div></div>;

  async function handleSubmit(data: GaleriFormData) {
    if (!session || !galeri) return;
    setIsLoading(true);
    try { await updateGaleri(session.token, { id: galeri.id, ...data }); router.push("/admin/galeri"); }
    finally { setIsLoading(false); }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header"><div><h1 className="admin-page-title">Edit Media</h1><p className="admin-page-subtitle"><em>{galeri?.judul}</em></p></div></div>
      <GaleriForm initial={galeri ?? undefined} onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Simpan Perubahan" />
    </div>
  );
}
