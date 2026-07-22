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
  { value: "foto", label: "Foto" },
  { value: "video", label: "Video" },
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
        <FormField id="galeri-judul" label="Judul" required error={errors.judul}>
          <Input id="galeri-judul" value={form.judul} onChange={(e) => set("judul", e.target.value)} error={!!errors.judul} placeholder="Judul foto / video" />
        </FormField>

        <FormField id="galeri-tipe" label="Tipe" required>
          <Select id="galeri-tipe" value={form.tipe} onChange={(e) => set("tipe", e.target.value as TipeGaleri)} options={TIPE_OPTIONS} />
        </FormField>

        <FormField id="galeri-tanggal" label="Tanggal" required error={errors.tanggal}>
          <Input id="galeri-tanggal" type="date" value={form.tanggal} onChange={(e) => set("tanggal", e.target.value)} error={!!errors.tanggal} />
        </FormField>

        <FormField id="galeri-url" label="URL Media" required error={errors.url} hint={form.tipe === "video" ? "URL YouTube atau sumber video" : "URL gambar (atau upload di bawah)"}>
          <Input id="galeri-url" value={form.url} onChange={(e) => set("url", e.target.value)} error={!!errors.url} placeholder="https://..." />
        </FormField>
      </div>

      {form.tipe === "foto" && (
        <ImageUpload label="Upload Foto (isi URL & thumbnail otomatis)" folder="GALERI" currentUrl={form.url || undefined}
          onUpload={(url) => { set("url", url); set("thumbnailUrl", url); }} />
      )}

      {form.tipe === "video" && (
        <ImageUpload label="Thumbnail Video" folder="GALERI" currentUrl={form.thumbnailUrl || undefined} onUpload={(url) => set("thumbnailUrl", url)} />
      )}

      <div className="admin-form-actions">
        <button type="button" onClick={() => router.back()} className="admin-btn admin-btn--ghost" disabled={isLoading}>Batal</button>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={isLoading} id="galeri-submit-btn">
          {isLoading ? <><div className="admin-spinner admin-spinner--sm" /> Menyimpan...</> : submitLabel}
        </button>
      </div>
    </form>
  );
}
