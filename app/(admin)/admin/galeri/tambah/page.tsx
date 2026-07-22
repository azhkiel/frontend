"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGaleri } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import GaleriForm from "@/components/admin/GaleriForm";
import type { Galeri } from "@/lib/types";

type GaleriFormData = Omit<Galeri, "id">;

export default function TambahGaleriPage() {
  const router = useRouter();
  const { session, isReady } = useAdminGuard();
  const [isLoading, setIsLoading] = useState(false);
  if (!isReady) return null;

  async function handleSubmit(data: GaleriFormData) {
    if (!session) return;
    setIsLoading(true);
    try { await createGaleri(session.token, data); router.push("/admin/galeri"); }
    finally { setIsLoading(false); }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header"><div><h1 className="admin-page-title">Tambah Media</h1></div></div>
      <GaleriForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Tambah Media" />
    </div>
  );
}
