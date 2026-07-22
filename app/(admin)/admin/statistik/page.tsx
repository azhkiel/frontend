"use client";
import { useState, useEffect } from "react";
import { getStatistik, updateStatistik } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { FormField, Input } from "@/components/admin/FormField";
import type { Statistik } from "@/lib/types";

export default function AdminStatistikPage() {
  const { session, isReady } = useAdminGuard();
  const [form, setForm] = useState<Statistik | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    getStatistik().then(setForm).catch((err) => setError(err instanceof Error ? err.message : "Gagal memuat.")).finally(() => setIsFetching(false));
  }, [isReady]);

  function set<K extends keyof Statistik>(key: K, value: Statistik[K]) {
    setForm((prev) => prev ? ({ ...prev, [key]: value }) : prev);
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !form) return;
    setIsSaving(true); setError(null); setSuccess(false);
    try { await updateStatistik(session.token, form); setSuccess(true); }
    catch (err) { setError(err instanceof Error ? err.message : "Gagal menyimpan."); }
    finally { setIsSaving(false); }
  }

  if (!isReady || isFetching) return null;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Statistik Desa</h1><p className="admin-page-subtitle">Perbarui data kependudukan dan koordinat peta.</p></div>
      </div>

      {error && <div className="admin-alert admin-alert--error" role="alert">{error}</div>}
      {success && <div className="admin-alert admin-alert--success" role="status">Statistik berhasil diperbarui!</div>}

      {form && (
        <form onSubmit={handleSubmit} className="admin-form" noValidate>
          <div className="admin-form-grid">
            <FormField id="stat-tahun" label="Tahun Data">
              <Input id="stat-tahun" type="number" value={form.tahunData} onChange={(e) => set("tahunData", parseInt(e.target.value))} />
            </FormField>
            <FormField id="stat-penduduk" label="Jumlah Penduduk">
              <Input id="stat-penduduk" type="number" value={form.jumlahPenduduk} onChange={(e) => set("jumlahPenduduk", parseInt(e.target.value))} />
            </FormField>
            <FormField id="stat-kk" label="Jumlah KK">
              <Input id="stat-kk" type="number" value={form.jumlahKK} onChange={(e) => set("jumlahKK", parseInt(e.target.value))} />
            </FormField>
            <FormField id="stat-lakilaki" label="Laki-Laki">
              <Input id="stat-lakilaki" type="number" value={form.jumlahLakiLaki} onChange={(e) => set("jumlahLakiLaki", parseInt(e.target.value))} />
            </FormField>
            <FormField id="stat-perempuan" label="Perempuan">
              <Input id="stat-perempuan" type="number" value={form.jumlahPerempuan} onChange={(e) => set("jumlahPerempuan", parseInt(e.target.value))} />
            </FormField>
            <FormField id="stat-lat" label="Latitude" hint="Koordinat peta, misal -7.546">
              <Input id="stat-lat" type="number" step="0.0001" value={form.latitude} onChange={(e) => set("latitude", parseFloat(e.target.value))} />
            </FormField>
            <FormField id="stat-lon" label="Longitude" hint="Koordinat peta, misal 112.2384">
              <Input id="stat-lon" type="number" step="0.0001" value={form.longitude} onChange={(e) => set("longitude", parseFloat(e.target.value))} />
            </FormField>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={isSaving} id="statistik-simpan-btn">
              {isSaving ? <><div className="admin-spinner admin-spinner--sm" /> Menyimpan...</> : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
