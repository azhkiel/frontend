"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, Input, Textarea, Select } from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Potensi, KategoriPotensi } from "@/lib/types";

type PotensiFormData = Omit<Potensi, "id">;

interface PotensiFormProps {
  initial?: Partial<PotensiFormData>;
  onSubmit: (data: PotensiFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

const KATEGORI_OPTIONS = [
  { value: "UMKM", label: "UMKM" },
  { value: "Wisata", label: "Wisata" },
  { value: "Produk Unggulan", label: "Produk Unggulan" },
];

export default function PotensiForm({ initial, onSubmit, isLoading, submitLabel = "Simpan" }: PotensiFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PotensiFormData>({
    nama: initial?.nama ?? "",
    kategori: initial?.kategori ?? "UMKM",
    deskripsi: initial?.deskripsi ?? "",
    gambarUrl: initial?.gambarUrl ?? "",
    kontak: initial?.kontak ?? "",
    lokasi: initial?.lokasi ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PotensiFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set<K extends keyof PotensiFormData>(key: K, value: PotensiFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.nama.trim())      e.nama = "Nama wajib diisi.";
    if (!form.deskripsi.trim()) e.deskripsi = "Deskripsi wajib diisi.";
    if (!form.lokasi.trim())    e.lokasi = "Lokasi wajib diisi.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form" noValidate>
      {submitError && <div className="admin-alert admin-alert--error" role="alert">{submitError}</div>}

      <div className="admin-form-grid">
        <FormField id="potensi-nama" label="Nama" required error={errors.nama}>
          <Input id="potensi-nama" value={form.nama} onChange={(e) => set("nama", e.target.value)} error={!!errors.nama} placeholder="Nama UMKM / wisata / produk" />
        </FormField>

        <FormField id="potensi-kategori" label="Kategori" required>
          <Select id="potensi-kategori" value={form.kategori} onChange={(e) => set("kategori", e.target.value as KategoriPotensi)} options={KATEGORI_OPTIONS} />
        </FormField>

        <FormField id="potensi-lokasi" label="Lokasi" required error={errors.lokasi}>
          <Input id="potensi-lokasi" value={form.lokasi} onChange={(e) => set("lokasi", e.target.value)} error={!!errors.lokasi} placeholder="Alamat / dusun" />
        </FormField>

        <FormField id="potensi-kontak" label="Kontak (opsional)">
          <Input id="potensi-kontak" value={form.kontak ?? ""} onChange={(e) => set("kontak", e.target.value)} placeholder="No. HP / WhatsApp" />
        </FormField>
      </div>

      <FormField id="potensi-deskripsi" label="Deskripsi" required error={errors.deskripsi}>
        <Textarea id="potensi-deskripsi" value={form.deskripsi} onChange={(e) => set("deskripsi", e.target.value)} error={!!errors.deskripsi} rows={5} placeholder="Deskripsi singkat potensi desa" />
      </FormField>

      <ImageUpload label="Gambar" folder="POTENSI" currentUrl={form.gambarUrl || undefined} onUpload={(url) => set("gambarUrl", url)} />

      <div className="admin-form-actions">
        <button type="button" onClick={() => router.back()} className="admin-btn admin-btn--ghost" disabled={isLoading}>Batal</button>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={isLoading} id="potensi-submit-btn">
          {isLoading ? <><div className="admin-spinner admin-spinner--sm" /> Menyimpan...</> : submitLabel}
        </button>
      </div>
    </form>
  );
}
