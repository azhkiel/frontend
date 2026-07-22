"use client";
import { useState, useEffect } from "react";
import { getProfil, updateProfil } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { FormField, Input, Textarea } from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Profil } from "@/lib/types";

export default function AdminProfilPage() {
  const { session, isReady } = useAdminGuard();
  const [form, setForm] = useState<Profil | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    getProfil().then(setForm).catch((err) => setError(err instanceof Error ? err.message : "Gagal memuat.")).finally(() => setIsFetching(false));
  }, [isReady]);

  function set<K extends keyof Profil>(key: K, value: Profil[K]) {
    setForm((prev) => prev ? ({ ...prev, [key]: value }) : prev);
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !form) return;
    setIsSaving(true); setError(null); setSuccess(false);
    try {
      await updateProfil(session.token, { ...form, id: "main" });
      setSuccess(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Gagal menyimpan."); }
    finally { setIsSaving(false); }
  }

  if (!isReady || isFetching) return null;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Profil Desa</h1><p className="admin-page-subtitle">Perbarui informasi profil desa.</p></div>
      </div>

      {error && <div className="admin-alert admin-alert--error" role="alert">{error}</div>}
      {success && <div className="admin-alert admin-alert--success" role="status">Profil berhasil diperbarui!</div>}

      {form && (
        <form onSubmit={handleSubmit} className="admin-form" noValidate>
          <div className="admin-form-grid">
            <FormField id="profil-namaDesa" label="Nama Desa" required>
              <Input id="profil-namaDesa" value={form.namaDesa} onChange={(e) => set("namaDesa", e.target.value)} />
            </FormField>
            <FormField id="profil-namaKecamatan" label="Nama Kecamatan">
              <Input id="profil-namaKecamatan" value={form.namaKecamatan} onChange={(e) => set("namaKecamatan", e.target.value)} />
            </FormField>
            <FormField id="profil-namaKabupaten" label="Nama Kabupaten">
              <Input id="profil-namaKabupaten" value={form.namaKabupaten} onChange={(e) => set("namaKabupaten", e.target.value)} />
            </FormField>
            <FormField id="profil-luasWilayah" label="Luas Wilayah (km²)">
              <Input id="profil-luasWilayah" type="number" step="0.1" value={form.luasWilayah} onChange={(e) => set("luasWilayah", parseFloat(e.target.value))} />
            </FormField>
            <FormField id="profil-jumlahDusun" label="Jumlah Dusun">
              <Input id="profil-jumlahDusun" type="number" value={form.jumlahDusun} onChange={(e) => set("jumlahDusun", parseInt(e.target.value))} />
            </FormField>
          </div>

          <FormField id="profil-sejarah" label="Sejarah Singkat">
            <Textarea id="profil-sejarah" value={form.sejarahSingkat} onChange={(e) => set("sejarahSingkat", e.target.value)} rows={5} />
          </FormField>

          <FormField id="profil-visi" label="Visi">
            <Textarea id="profil-visi" value={form.visi} onChange={(e) => set("visi", e.target.value)} rows={3} />
          </FormField>

          <FormField id="profil-misi" label="Misi" hint="Satu poin per baris">
            <Textarea id="profil-misi" value={form.misi} onChange={(e) => set("misi", e.target.value)} rows={6} placeholder={"Poin 1\nPoin 2\nPoin 3"} />
          </FormField>

          <div className="admin-form-grid">
            <ImageUpload label="Logo Desa" folder="PROFIL" currentUrl={form.logoUrl || undefined} onUpload={(url) => set("logoUrl", url)} />
            <ImageUpload label="Gambar Hero (Banner)" folder="PROFIL" currentUrl={form.heroImageUrl || undefined} onUpload={(url) => set("heroImageUrl", url)} />
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={isSaving} id="profil-simpan-btn">
              {isSaving ? <><div className="admin-spinner admin-spinner--sm" /> Menyimpan...</> : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
