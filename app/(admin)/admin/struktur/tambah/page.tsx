"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createStruktur } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import StrukturForm from "@/components/admin/StrukturForm";
import type { StrukturOrganisasi } from "@/lib/types";

type StrukturFormData = Omit<StrukturOrganisasi, "id">;

export default function TambahStrukturPage() {
  const router = useRouter();
  const { session, isReady } = useAdminGuard();
  const [isLoading, setIsLoading] = useState(false);
  if (!isReady) return null;

  async function handleSubmit(data: StrukturFormData) {
    if (!session) return;
    setIsLoading(true);
    try { await createStruktur(session.token, data); router.push("/admin/struktur"); }
    finally { setIsLoading(false); }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header"><div><h1 className="admin-page-title">Tambah Perangkat Desa</h1></div></div>
      <StrukturForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Tambah Perangkat" />
    </div>
  );
}
