"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/api";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { FormField, Input, Select } from "@/components/admin/FormField";
import { saveLocalUser } from "@/lib/localUsers";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin — dapat kelola konten (berita, potensi, galeri, dll)" },
  { value: "superadmin", label: "Super Admin — dapat kelola konten + akun pengguna" },
];

export default function TambahUserPage() {
  const router = useRouter();
  const { session, isReady } = useAdminGuard("superadmin");
  const [form, setForm] = useState({
    username: "",
    password: "",
    nama: "",
    role: "admin" as "admin" | "superadmin",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<typeof form> = {};
    if (!form.username.trim()) e.username = "Username wajib diisi.";
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username))
      e.username = "Username hanya boleh huruf, angka, dan underscore (_).";
    if (form.password.length < 8)
      e.password = "Password minimal 8 karakter.";
    if (!form.nama.trim()) e.nama = "Nama wajib diisi.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !session) return;
    setSubmitError(null);
    setIsLoading(true);
    try {
      const res = await createUser(session.token, form);
      // Simpan ke localStorage agar bisa ditampilkan di halaman users
      if (res.id) {
        saveLocalUser({
          id: res.id,
          username: form.username,
          nama: form.nama,
          role: form.role,
          password: form.password,
          aktif: true,
          createdAt: new Date().toISOString(),
        });
      }
      router.push("/admin/users");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isReady) return null;

  const passwordStrength = form.password.length === 0
    ? null
    : form.password.length < 8
    ? { level: "lemah", color: "#DC2626" }
    : form.password.length < 12
    ? { level: "cukup", color: "#D97706" }
    : { level: "kuat", color: "#16A34A" };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tambah Pengguna</h1>
          <p className="admin-page-subtitle">
            Buat akun admin baru untuk mengakses panel admin desa.
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="admin-info-box" style={{ marginBottom: "1.5rem" }}>
        <div className="admin-info-box-icon">🔐</div>
        <div>
          <p className="font-semibold text-sm mb-1">Keamanan Akun</p>
          <p className="text-sm text-text-secondary">
            Password akan di-<strong>hash otomatis</strong> di server sebelum disimpan.
            Gunakan password yang kuat (minimal 8 karakter, campuran huruf besar, kecil, angka, dan simbol).
            Setelah akun dibuat, password <strong>tidak dapat diubah</strong> — untuk ganti password,
            hapus akun lama dan buat akun baru.
          </p>
        </div>
      </div>

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
            id="user-username"
            label="Username"
            required
            error={errors.username}
            hint="Hanya huruf (a-z, A-Z), angka (0-9), dan garis bawah (_). Tidak bisa diubah setelah dibuat."
          >
            <Input
              id="user-username"
              value={form.username}
              onChange={(e) => set("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              error={!!errors.username}
              placeholder="contoh: sekdes_2026"
              autoComplete="off"
            />
          </FormField>

          <FormField
            id="user-nama"
            label="Nama Lengkap"
            required
            error={errors.nama}
            hint="Nama yang akan ditampilkan di panel admin saat login."
          >
            <Input
              id="user-nama"
              value={form.nama}
              onChange={(e) => set("nama", e.target.value)}
              error={!!errors.nama}
              placeholder="contoh: Budi Santoso"
            />
          </FormField>

          <FormField
            id="user-password"
            label="Password"
            required
            error={errors.password}
            hint={
              passwordStrength
                ? `Kekuatan password: `
                : "Minimal 8 karakter. Gunakan kombinasi huruf besar, kecil, angka, dan simbol."
            }
          >
            <div className="form-input-group">
              <Input
                id="user-password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                error={!!errors.password}
                className="form-input--with-suffix"
                placeholder="Min. 8 karakter"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="form-input-suffix-btn"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
            {/* Password strength indicator */}
            {passwordStrength && (
              <div style={{ marginTop: "0.375rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ flex: 1, height: "4px", backgroundColor: "#E5E7EB", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    borderRadius: "2px",
                    backgroundColor: passwordStrength.color,
                    width: passwordStrength.level === "lemah" ? "33%" : passwordStrength.level === "cukup" ? "66%" : "100%",
                    transition: "width 200ms ease-out",
                  }} />
                </div>
                <span style={{ fontSize: "0.7rem", fontWeight: 600, color: passwordStrength.color, whiteSpace: "nowrap" }}>
                  {passwordStrength.level}
                </span>
              </div>
            )}
          </FormField>

          <FormField
            id="user-role"
            label="Role"
            required
            hint="Pilih hak akses yang sesuai. Berikan Super Admin hanya kepada orang yang sangat dipercaya."
          >
            <Select
              id="user-role"
              value={form.role}
              onChange={(e) => set("role", e.target.value as "admin" | "superadmin")}
              options={ROLE_OPTIONS}
            />
          </FormField>
        </div>

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
            id="user-submit-btn"
          >
            {isLoading ? (
              <>
                <div className="admin-spinner admin-spinner--sm" />
                Membuat akun...
              </>
            ) : (
              "Tambah Pengguna"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
