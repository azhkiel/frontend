"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, Input, Textarea, Select } from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Berita, KategoriBerita } from "@/lib/types";

type BeritaFormData = Omit<Berita, "id">;

interface BeritaFormProps {
  initial?: Partial<BeritaFormData>;
  onSubmit: (data: BeritaFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

const KATEGORI_OPTIONS = [
  { value: "Pengumuman", label: "Pengumuman" },
  { value: "Kegiatan", label: "Kegiatan" },
  { value: "Pembangunan", label: "Pembangunan" },
  { value: "Lainnya", label: "Lainnya" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function BeritaForm({ initial, onSubmit, isLoading, submitLabel = "Simpan" }: BeritaFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<BeritaFormData>({
    judul: initial?.judul ?? "",
    slug: initial?.slug ?? "",
    ringkasan: initial?.ringkasan ?? "",
    isi: initial?.isi ?? "",
    gambarUrl: initial?.gambarUrl ?? "",
    tanggal: initial?.tanggal ?? new Date().toISOString().split("T")[0],
    penulis: initial?.penulis ?? "Admin Desa",
    kategori: initial?.kategori ?? "Lainnya",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BeritaFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set<K extends keyof BeritaFormData>(key: K, value: BeritaFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.judul.trim())    e.judul = "Judul wajib diisi.";
    if (!form.slug.trim())     e.slug = "Slug wajib diisi.";
    if (!form.ringkasan.trim()) e.ringkasan = "Ringkasan wajib diisi.";
    if (!form.isi.trim())      e.isi = "Isi berita wajib diisi.";
    if (!form.tanggal)         e.tanggal = "Tanggal wajib diisi.";
    if (!form.penulis.trim())  e.penulis = "Penulis wajib diisi.";
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
      {submitError && (
        <div className="admin-alert admin-alert--error" role="alert">
          {submitError}
        </div>
      )}

      <div className="admin-form-grid">
        <FormField id="berita-judul" label="Judul" required error={errors.judul}>
          <Input
            id="berita-judul"
            value={form.judul}
            onChange={(e) => {
              set("judul", e.target.value);
              if (!initial?.slug) set("slug", slugify(e.target.value));
            }}
            error={!!errors.judul}
            placeholder="Judul berita"
          />
        </FormField>

        <FormField
          id="berita-slug"
          label="Slug (URL)"
          required
          error={errors.slug}
          hint="Otomatis dari judul. Hanya huruf kecil, angka, dan tanda hubung."
        >
          <Input
            id="berita-slug"
            value={form.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
            error={!!errors.slug}
            placeholder="contoh: musdes-pembangunan-jalan"
          />
        </FormField>

        <FormField id="berita-kategori" label="Kategori" required>
          <Select
            id="berita-kategori"
            value={form.kategori}
            onChange={(e) => set("kategori", e.target.value as KategoriBerita)}
            options={KATEGORI_OPTIONS}
          />
        </FormField>

        <FormField id="berita-tanggal" label="Tanggal" required error={errors.tanggal}>
          <Input
            id="berita-tanggal"
            type="date"
            value={form.tanggal}
            onChange={(e) => set("tanggal", e.target.value)}
            error={!!errors.tanggal}
          />
        </FormField>

        <FormField id="berita-penulis" label="Penulis" required error={errors.penulis}>
          <Input
            id="berita-penulis"
            value={form.penulis}
            onChange={(e) => set("penulis", e.target.value)}
            error={!!errors.penulis}
            placeholder="Nama penulis"
          />
        </FormField>
      </div>

      <FormField id="berita-ringkasan" label="Ringkasan" required error={errors.ringkasan}>
        <Textarea
          id="berita-ringkasan"
          value={form.ringkasan}
          onChange={(e) => set("ringkasan", e.target.value)}
          error={!!errors.ringkasan}
          rows={3}
          placeholder="Ringkasan singkat berita (tampil di kartu & daftar)"
        />
      </FormField>

      <FormField id="berita-isi" label="Isi Berita" required error={errors.isi}>
        <Textarea
          id="berita-isi"
          value={form.isi}
          onChange={(e) => set("isi", e.target.value)}
          error={!!errors.isi}
          rows={10}
          placeholder="Isi lengkap berita (mendukung markdown sederhana)"
        />
      </FormField>

      <ImageUpload
        label="Gambar Utama"
        folder="BERITA"
        currentUrl={form.gambarUrl || undefined}
        onUpload={(url) => set("gambarUrl", url)}
      />

      <div className="admin-form-actions">
        <button
          type="button"
          onClick={() => router.back()}
          className="admin-btn admin-btn--ghost"
          disabled={isLoading}
        >
          Batal
        </button>
        <button
          type="submit"
          className="admin-btn admin-btn--primary"
          disabled={isLoading}
          id="berita-submit-btn"
        >
          {isLoading ? (
            <>
              <div className="admin-spinner admin-spinner--sm" />
              Menyimpan...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
