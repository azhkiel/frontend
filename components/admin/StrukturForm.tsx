"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, Input } from "@/components/admin/FormField";
import ImageUpload from "@/components/admin/ImageUpload";
import type { StrukturOrganisasi } from "@/lib/types";

type StrukturFormData = Omit<StrukturOrganisasi, "id">;

interface StrukturFormProps {
  initial?: Partial<StrukturFormData>;
  onSubmit: (data: StrukturFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function StrukturForm({ initial, onSubmit, isLoading, submitLabel = "Simpan" }: StrukturFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<StrukturFormData>({
    nama: initial?.nama ?? "",
    jabatan: initial?.jabatan ?? "",
    fotoUrl: initial?.fotoUrl ?? "",
    noHp: initial?.noHp ?? "",
    urutan: initial?.urutan ?? 99,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof StrukturFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set<K extends keyof StrukturFormData>(key: K, value: StrukturFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.nama.trim())    e.nama = "Nama wajib diisi.";
    if (!form.jabatan.trim()) e.jabatan = "Jabatan wajib diisi.";
    if (form.noHp && !/^[\d\s\+\-\(\)]+$/.test(form.noHp))
      e.noHp = "Format nomor HP tidak valid. Gunakan angka, spasi, +, atau tanda hubung.";
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
          id="struktur-nama"
          label="Nama Lengkap"
          required
          error={errors.nama}
          hint="Nama lengkap perangkat desa sesuai dokumen resmi."
        >
          <Input
            id="struktur-nama"
            value={form.nama}
            onChange={(e) => set("nama", e.target.value)}
            error={!!errors.nama}
            placeholder="contoh: Budi Santoso, S.Pd."
          />
        </FormField>

        <FormField
          id="struktur-jabatan"
          label="Jabatan"
          required
          error={errors.jabatan}
          hint='Jabatan resmi dalam struktur pemerintahan desa. Contoh: "Kepala Desa", "Sekretaris Desa", "Kaur Keuangan".'
        >
          <Input
            id="struktur-jabatan"
            value={form.jabatan}
            onChange={(e) => set("jabatan", e.target.value)}
            error={!!errors.jabatan}
            placeholder="Kepala Desa / Sekretaris Desa / Kaur / dll"
          />
        </FormField>

        <FormField
          id="struktur-nohp"
          label="No. HP / WhatsApp (opsional)"
          error={errors.noHp}
          hint='Nomor yang bisa dihubungi warga. Format: "08xxxxxxxxxx" atau "+628xxxxxxxxxx". Akan ditampilkan di halaman struktur.'
        >
          <Input
            id="struktur-nohp"
            value={form.noHp ?? ""}
            onChange={(e) => set("noHp", e.target.value)}
            error={!!errors.noHp}
            placeholder="08xxxxxxxxxx"
            type="tel"
          />
        </FormField>

        <FormField
          id="struktur-urutan"
          label="Urutan Tampil"
          hint="Angka lebih kecil tampil lebih awal di halaman struktur. Kepala Desa biasanya urutan 1, Sekdes 2, dst."
        >
          <Input
            id="struktur-urutan"
            type="number"
            min={1}
            max={999}
            value={form.urutan}
            onChange={(e) => set("urutan", parseInt(e.target.value) || 99)}
          />
        </FormField>
      </div>

      <ImageUpload
        label="Foto Profil Perangkat Desa"
        folder="STRUKTUR"
        currentUrl={form.fotoUrl || undefined}
        onUpload={(url) => set("fotoUrl", url)}
      />

      <div className="admin-form-actions">
        <button type="button" onClick={() => router.back()} className="admin-btn admin-btn--ghost" disabled={isLoading}>
          Batal
        </button>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={isLoading} id="struktur-submit-btn">
          {isLoading ? <><div className="admin-spinner admin-spinner--sm" /> Menyimpan...</> : submitLabel}
        </button>
      </div>
    </form>
  );
}
