"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPotensi } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import PotensiForm from "@/components/admin/PotensiForm";
import type { Potensi } from "@/lib/types";

type PotensiFormData = Omit<Potensi, "id">;

export default function TambahPotensiPage() {
  const router = useRouter();
  const { session, isReady } = useAdminGuard();
  const [isLoading, setIsLoading] = useState(false);
  if (!isReady) return null;

  async function handleSubmit(data: PotensiFormData) {
    if (!session) return;
    setIsLoading(true);
    try { await createPotensi(session.token, data); router.push("/admin/potensi"); }
    finally { setIsLoading(false); }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Tambah Potensi</h1></div>
      </div>
      <PotensiForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Tambah Potensi" />
    </div>
  );
}
