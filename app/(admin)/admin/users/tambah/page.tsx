"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { FormField, Input, Select } from "@/components/admin/FormField";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Super Admin" },
];

export default function TambahUserPage() {
  const router = useRouter();
  const { session, isReady } = useAdminGuard("superadmin");
  const [form, setForm] = useState({ username: "", password: "", nama: "", role: "admin" as "admin" | "superadmin" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<typeof form> = {};
    if (!form.username.trim()) e.username = "Username wajib diisi.";
    if (form.password.length < 8) e.password = "Password minimal 8 karakter.";
    if (!form.nama.trim()) e.nama = "Nama wajib diisi.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !session) return;
    setSubmitError(null); setIsLoading(true);
    try { await createUser(session.token, form); router.push("/admin/users"); }
    catch (err) { setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan."); }
    finally { setIsLoading(false); }
  }

  if (!isReady) return null;

  return (
    <div className="admin-page">
      <div className="admin-page-header"><div><h1 className="admin-page-title">Tambah Pengguna</h1><p className="admin-page-subtitle">Buat akun admin baru.</p></div></div>

      <form onSubmit={handleSubmit} className="admin-form" noValidate>
        {submitError && <div className="admin-alert admin-alert--error" role="alert">{submitError}</div>}

        <div className="admin-form-grid">
          <FormField id="user-username" label="Username" required error={errors.username}>
            <Input id="user-username" value={form.username} onChange={(e) => set("username", e.target.value)} error={!!errors.username} placeholder="Hanya huruf, angka, underscore" />
          </FormField>

          <FormField id="user-nama" label="Nama Lengkap" required error={errors.nama}>
            <Input id="user-nama" value={form.nama} onChange={(e) => set("nama", e.target.value)} error={!!errors.nama} placeholder="Nama tampil" />
          </FormField>

          <FormField id="user-password" label="Password" required error={errors.password} hint="Minimal 8 karakter">
            <div className="form-input-group">
              <Input id="user-password" type={showPassword ? "text" : "password"} value={form.password}
                onChange={(e) => set("password", e.target.value)} error={!!errors.password}
                className="form-input--with-suffix" placeholder="Min. 8 karakter" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="form-input-suffix-btn" aria-label="Toggle password">
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </FormField>

          <FormField id="user-role" label="Role" required>
            <Select id="user-role" value={form.role} onChange={(e) => set("role", e.target.value as "admin" | "superadmin")} options={ROLE_OPTIONS} />
          </FormField>
        </div>

        <div className="admin-form-actions">
          <button type="button" onClick={() => router.back()} className="admin-btn admin-btn--ghost" disabled={isLoading}>Batal</button>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={isLoading} id="user-submit-btn">
            {isLoading ? <><div className="admin-spinner admin-spinner--sm" /> Membuat...</> : "Tambah Pengguna"}
          </button>
        </div>
      </form>
    </div>
  );
}
