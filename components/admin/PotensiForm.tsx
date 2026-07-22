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
  { value: "UMKM", label: "🏪 UMKM — usaha mikro kecil menengah warga desa" },
  { value: "Wisata", label: "🌿 Wisata — destinasi wisata alam, budaya, atau edukasi" },
  { value: "Produk Unggulan", label: "⭐ Produk Unggulan — produk khas atau andalan desa" },
];

const DESKRIPSI_MAX = 500;

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
    else if (form.deskripsi.length > DESKRIPSI_MAX)
      e.deskripsi = `Deskripsi terlalu panjang (maks. ${DESKRIPSI_MAX} karakter).`;
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

  const deskripsiLen = form.deskripsi.length;
  const deskripsiOver = deskripsiLen > DESKRIPSI_MAX;

  return (
    <form onSubmit={handleSubmit} className="admin-form" noValidate>
      {submitError && (
        <div className="admin-alert admin-alert--error" role="alert">
          {submitError}
        </div>
      )}

      <div className="admin-form-grid">
        <FormField
          id="potensi-nama"
          label="Nama"
          required
          error={errors.nama}
          hint='Nama lengkap UMKM, tempat wisata, atau produk. Contoh: "Keripik Singkong Bu Sari", "Taman Desa Sumber".'
        >
          <Input
            id="potensi-nama"
            value={form.nama}
            onChange={(e) => set("nama", e.target.value)}
            error={!!errors.nama}
            placeholder="Nama UMKM / wisata / produk unggulan"
          />
        </FormField>

        <FormField
          id="potensi-kategori"
          label="Kategori"
          required
          hint="Pilih kategori yang paling sesuai untuk pengelompokan di halaman potensi desa."
        >
          <Select
            id="potensi-kategori"
            value={form.kategori}
            onChange={(e) => set("kategori", e.target.value as KategoriPotensi)}
            options={KATEGORI_OPTIONS}
          />
        </FormField>

        <FormField
          id="potensi-lokasi"
          label="Lokasi"
          required
          error={errors.lokasi}
          hint='Alamat atau nama dusun. Contoh: "Dusun Krajan RT 02/RW 01", "Jl. Desa No. 10".'
        >
          <Input
            id="potensi-lokasi"
            value={form.lokasi}
            onChange={(e) => set("lokasi", e.target.value)}
            error={!!errors.lokasi}
            placeholder="Alamat / nama dusun"
          />
        </FormField>

        <FormField
          id="potensi-kontak"
          label="Kontak (opsional)"
          hint='Nomor WhatsApp atau HP yang bisa dihubungi. Format: "08xxxxxxxxxx" atau "+628xxxxxxxxxx".'
        >
          <Input
            id="potensi-kontak"
            value={form.kontak ?? ""}
            onChange={(e) => set("kontak", e.target.value)}
            placeholder="08xxxxxxxxxx"
            type="tel"
          />
        </FormField>
      </div>

      <FormField
        id="potensi-deskripsi"
        label="Deskripsi"
        required
        error={errors.deskripsi}
        hint="Penjelasan singkat tentang produk, layanan, atau daya tarik. Akan ditampilkan di halaman potensi desa."
      >
        <div style={{ position: "relative" }}>
          <Textarea
            id="potensi-deskripsi"
            value={form.deskripsi}
            onChange={(e) => set("deskripsi", e.target.value)}
            error={!!errors.deskripsi || deskripsiOver}
            rows={5}
            placeholder="Deskripsikan keunggulan, produk, atau daya tarik potensi ini secara singkat dan menarik..."
          />
          <span style={{
            position: "absolute",
            bottom: "0.5rem",
            right: "0.75rem",
            fontSize: "0.7rem",
            color: deskripsiOver ? "#DC2626" : "#767668",
            fontVariantNumeric: "tabular-nums",
          }}>
            {deskripsiLen}/{DESKRIPSI_MAX}
          </span>
        </div>
      </FormField>

      <ImageUpload
        label="Foto Potensi"
        folder="POTENSI"
        currentUrl={form.gambarUrl || undefined}
        onUpload={(url) => set("gambarUrl", url)}
      />

      <div className="admin-form-actions">
        <button type="button" onClick={() => router.back()} className="admin-btn admin-btn--ghost" disabled={isLoading}>
          Batal
        </button>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={isLoading} id="potensi-submit-btn">
          {isLoading ? <><div className="admin-spinner admin-spinner--sm" /> Menyimpan...</> : submitLabel}
        </button>
      </div>
    </form>
  );
}
