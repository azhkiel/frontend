"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, Input, Select } from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Galeri, TipeGaleri } from "@/lib/types";

type GaleriFormData = Omit<Galeri, "id">;

interface GaleriFormProps {
  initial?: Partial<GaleriFormData>;
  onSubmit: (data: GaleriFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

const TIPE_OPTIONS = [
  { value: "foto", label: "🖼️ Foto — gambar kegiatan, momen, atau dokumentasi desa" },
  { value: "video", label: "🎬 Video — rekaman video dari YouTube atau sumber lain" },
];

export default function GaleriForm({ initial, onSubmit, isLoading, submitLabel = "Simpan" }: GaleriFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<GaleriFormData>({
    judul: initial?.judul ?? "",
    tipe: initial?.tipe ?? "foto",
    url: initial?.url ?? "",
    thumbnailUrl: initial?.thumbnailUrl ?? "",
    tanggal: initial?.tanggal ?? new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof GaleriFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set<K extends keyof GaleriFormData>(key: K, value: GaleriFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.judul.trim()) e.judul = "Judul wajib diisi.";
    if (!form.url.trim())   e.url = "URL wajib diisi.";
    if (!form.tanggal)      e.tanggal = "Tanggal wajib diisi.";
    if (form.tipe === "video" && form.url && !form.url.includes("youtube") && !form.url.includes("youtu.be") && !form.url.startsWith("http")) {
      e.url = "URL video harus diawali dengan https://";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError(null);
    try { await onSubmit(form); }
    catch (err) { setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan."); }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form" noValidate>
      {submitError && <div className="admin-alert admin-alert--error" role="alert">{submitError}</div>}

      <div className="admin-form-grid">
        <FormField
          id="galeri-judul"
          label="Judul"
          required
          error={errors.judul}
          hint="Judul singkat deskriptif untuk foto atau video ini."
        >
          <Input
            id="galeri-judul"
            value={form.judul}
            onChange={(e) => set("judul", e.target.value)}
            error={!!errors.judul}
            placeholder="contoh: Gotong Royong Jalan Dusun Krajan"
          />
        </FormField>

        <FormField
          id="galeri-tipe"
          label="Tipe Konten"
          required
          hint="Pilih Foto untuk upload gambar, atau Video untuk embed dari YouTube."
        >
          <Select
            id="galeri-tipe"
            value={form.tipe}
            onChange={(e) => set("tipe", e.target.value as TipeGaleri)}
            options={TIPE_OPTIONS}
          />
        </FormField>

        <FormField
          id="galeri-tanggal"
          label="Tanggal"
          required
          error={errors.tanggal}
          hint="Tanggal saat foto/video diambil atau kegiatan berlangsung."
        >
          <Input
            id="galeri-tanggal"
            type="date"
            value={form.tanggal}
            onChange={(e) => set("tanggal", e.target.value)}
            error={!!errors.tanggal}
          />
        </FormField>

        <FormField
          id="galeri-url"
          label={form.tipe === "video" ? "URL Video" : "URL Gambar"}
          required
          error={errors.url}
          hint={
            form.tipe === "video"
              ? 'URL video YouTube. Contoh: "https://www.youtube.com/watch?v=xxxxx" atau "https://youtu.be/xxxxx". Untuk embed, URL akan dikonversi otomatis.'
              : 'URL gambar dari Google Drive (setelah upload di bawah). Format: "https://drive.google.com/uc?export=view&id=...".'
          }
        >
          <Input
            id="galeri-url"
            value={form.url}
            onChange={(e) => set("url", e.target.value)}
            error={!!errors.url}
            placeholder={form.tipe === "video" ? "https://www.youtube.com/watch?v=..." : "https://drive.google.com/uc?..."}
          />
        </FormField>
      </div>

      {form.tipe === "foto" && (
        <ImageUpload
          label="Upload Foto (URL & thumbnail terisi otomatis setelah upload)"
          folder="GALERI"
          currentUrl={form.url || undefined}
          onUpload={(url) => { set("url", url); set("thumbnailUrl", url); }}
        />
      )}

      {form.tipe === "video" && (
        <ImageUpload
          label="Thumbnail Video (gambar pratinjau yang ditampilkan di galeri)"
          folder="GALERI"
          currentUrl={form.thumbnailUrl || undefined}
          onUpload={(url) => set("thumbnailUrl", url)}
        />
      )}

      <div className="admin-form-actions">
        <button type="button" onClick={() => router.back()} className="admin-btn admin-btn--ghost" disabled={isLoading}>
          Batal
        </button>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={isLoading} id="galeri-submit-btn">
          {isLoading ? <><div className="admin-spinner admin-spinner--sm" /> Menyimpan...</> : submitLabel}
        </button>
      </div>
    </form>
  );
}
