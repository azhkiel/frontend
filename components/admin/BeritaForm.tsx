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
  { value: "Pengumuman", label: "📢 Pengumuman — informasi resmi pemerintah desa" },
  { value: "Kegiatan", label: "🎉 Kegiatan — laporan kegiatan warga & pemerintah" },
  { value: "Pembangunan", label: "🏗️ Pembangunan — infrastruktur & proyek desa" },
  { value: "Lainnya", label: "📌 Lainnya — konten lain yang tidak termasuk kategori di atas" },
];

const RINGKASAN_MAX = 300;

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
    else if (form.ringkasan.length > RINGKASAN_MAX)
      e.ringkasan = `Ringkasan terlalu panjang (maks. ${RINGKASAN_MAX} karakter).`;
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

  const ringkasanLen = form.ringkasan.length;
  const ringkasanOver = ringkasanLen > RINGKASAN_MAX;

  return (
    <form onSubmit={handleSubmit} className="admin-form" noValidate>
      {submitError && (
        <div className="admin-alert admin-alert--error" role="alert">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {submitError}
        </div>
      )}

      <div className="admin-form-grid">
        <FormField
          id="berita-judul"
          label="Judul Berita"
          required
          error={errors.judul}
          hint="Judul singkat dan informatif. Akan digunakan sebagai judul halaman dan kartu berita."
        >
          <Input
            id="berita-judul"
            value={form.judul}
            onChange={(e) => {
              set("judul", e.target.value);
              if (!initial?.slug) set("slug", slugify(e.target.value));
            }}
            error={!!errors.judul}
            placeholder="contoh: Musyawarah Desa Bahas Rencana Pembangunan Jalan"
          />
        </FormField>

        <FormField
          id="berita-slug"
          label="Slug (URL)"
          required
          error={errors.slug}
          hint='Otomatis dibuat dari judul. Hanya huruf kecil, angka, dan tanda hubung (-). Contoh: "musdes-pembangunan-jalan".'
        >
          <Input
            id="berita-slug"
            value={form.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
            error={!!errors.slug}
            placeholder="musdes-pembangunan-jalan"
          />
        </FormField>

        <FormField
          id="berita-kategori"
          label="Kategori"
          required
          hint="Pilih kategori yang paling sesuai untuk membantu pembaca menemukan berita."
        >
          <Select
            id="berita-kategori"
            value={form.kategori}
            onChange={(e) => set("kategori", e.target.value as KategoriBerita)}
            options={KATEGORI_OPTIONS}
          />
        </FormField>

        <FormField
          id="berita-tanggal"
          label="Tanggal Publikasi"
          required
          error={errors.tanggal}
          hint="Tanggal berita dipublikasikan (format YYYY-MM-DD, pilih dari kalender)."
        >
          <Input
            id="berita-tanggal"
            type="date"
            value={form.tanggal}
            onChange={(e) => set("tanggal", e.target.value)}
            error={!!errors.tanggal}
          />
        </FormField>

        <FormField
          id="berita-penulis"
          label="Penulis"
          required
          error={errors.penulis}
          hint='Nama penulis atau sumber berita. Contoh: "Admin Desa", "Sekretaris Desa".'
        >
          <Input
            id="berita-penulis"
            value={form.penulis}
            onChange={(e) => set("penulis", e.target.value)}
            error={!!errors.penulis}
            placeholder="Admin Desa"
          />
        </FormField>
      </div>

      <FormField
        id="berita-ringkasan"
        label="Ringkasan"
        required
        error={errors.ringkasan}
        hint="Deskripsi singkat yang tampil di kartu berita dan halaman daftar berita."
      >
        <div style={{ position: "relative" }}>
          <Textarea
            id="berita-ringkasan"
            value={form.ringkasan}
            onChange={(e) => set("ringkasan", e.target.value)}
            error={!!errors.ringkasan || ringkasanOver}
            rows={3}
            placeholder="Ringkasan singkat berita (maks. 300 karakter). Tampil di kartu berita di beranda & halaman daftar berita."
          />
          <span style={{
            position: "absolute",
            bottom: "0.5rem",
            right: "0.75rem",
            fontSize: "0.7rem",
            color: ringkasanOver ? "#DC2626" : "#767668",
            fontVariantNumeric: "tabular-nums",
          }}>
            {ringkasanLen}/{RINGKASAN_MAX}
          </span>
        </div>
      </FormField>

      <FormField
        id="berita-isi"
        label="Isi Berita"
        required
        error={errors.isi}
        hint="Isi lengkap berita. Mendukung pemisah paragraf dengan baris kosong. Gunakan ** untuk tebal, _teks_ untuk miring."
      >
        <Textarea
          id="berita-isi"
          value={form.isi}
          onChange={(e) => set("isi", e.target.value)}
          error={!!errors.isi}
          rows={12}
          placeholder={"Tulis isi lengkap berita di sini...\n\nBuat paragraf baru dengan menekan Enter dua kali.\n\nContoh format:\n**Teks Tebal** untuk judul bagian\n_Teks Miring_ untuk penekanan"}
        />
      </FormField>

      <ImageUpload
        label="Gambar Utama Berita"
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
