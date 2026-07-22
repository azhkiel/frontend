"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { deleteUser, updateUser } from "@/lib/api";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { type LocalUser, getLocalUsers, saveLocalUsers, saveLocalUser } from "@/lib/localUsers";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
    </svg>
  );
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { session, isReady } = useAdminGuard("superadmin");
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<LocalUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [editingUser, setEditingUser] = useState<LocalUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadUsers = useCallback(() => {
    setUsers(getLocalUsers());
  }, []);

  useEffect(() => {
    if (isReady) loadUsers();
  }, [isReady, loadUsers]);

  function togglePassword(id: string) {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleDelete() {
    if (!deleteTarget || !session) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteUser(session.token, deleteTarget.id);
      const updated = getLocalUsers().filter((u) => u.id !== deleteTarget.id);
      saveLocalUsers(updated);
      setUsers(updated);
      setDeleteTarget(null);
      setSuccess(`Pengguna "${deleteTarget.nama}" berhasil dihapus.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus pengguna.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser || !session) return;
    setIsSaving(true);
    setError(null);
    try {
      await updateUser(session.token, {
        id: editingUser.id,
        nama: editingUser.nama,
        role: editingUser.role,
        aktif: editingUser.aktif,
      });
      saveLocalUser(editingUser);
      setUsers(getLocalUsers());
      setEditingUser(null);
      setSuccess(`Data pengguna "${editingUser.nama}" berhasil diperbarui.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui pengguna.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!isReady) return null;

  return (
    <div className="admin-page" style={{ maxWidth: "none" }}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manajemen Pengguna</h1>
          <p className="admin-page-subtitle">
            Kelola akun admin. Hanya <strong>superadmin</strong> yang bisa mengakses menu ini.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/users/tambah")}
          className="admin-btn admin-btn--primary"
          id="users-tambah-btn"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Pengguna
        </button>
      </div>

      {error && (
        <div className="admin-alert admin-alert--error" role="alert">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="admin-alert admin-alert--success" role="status">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}

      {/* Info Box */}
      <div className="admin-info-box" style={{ marginBottom: "1.5rem" }}>
        <div className="admin-info-box-icon">ℹ️</div>
        <div>
          <p className="font-semibold text-sm mb-1">Catatan Penting</p>
          <p className="text-sm text-text-secondary">
            Daftar pengguna di sini berasal dari data yang disimpan <strong>secara lokal</strong> saat kamu membuat akun baru
            (API backend tidak menyediakan endpoint <code>getUsers</code>). Password yang ditampilkan adalah password <em>saat dibuat</em> —
            password asli di server sudah di-hash dan tidak dapat dikembalikan ke plaintext.
            Untuk update password, hapus akun lama dan buat akun baru.
          </p>
        </div>
      </div>

      {/* Tabel Pengguna */}
      {users.length === 0 ? (
        <div className="users-empty-state">
          <div className="users-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-12 h-12 text-primary-100">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <p className="users-empty-title">Belum ada pengguna</p>
          <p className="users-empty-desc">Klik <strong>Tambah Pengguna</strong> untuk membuat akun admin pertama.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table" aria-label="Daftar pengguna">
            <thead>
              <tr>
                <th className="admin-th">Nama</th>
                <th className="admin-th">Username</th>
                <th className="admin-th">Password (saat buat)</th>
                <th className="admin-th">Role</th>
                <th className="admin-th">Status</th>
                <th className="admin-th">Dibuat</th>
                <th className="admin-th admin-th--actions">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="admin-tr">
                  <td className="admin-td">
                    <div className="users-cell-name">
                      <div className="users-avatar">
                        {user.nama.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user.nama}</span>
                    </div>
                  </td>
                  <td className="admin-td">
                    <code className="users-username">{user.username}</code>
                  </td>
                  <td className="admin-td">
                    <div className="users-password-cell">
                      <span className="users-password-text">
                        {showPasswords[user.id] ? user.password : "•".repeat(Math.min(user.password.length, 10))}
                      </span>
                      <button
                        type="button"
                        onClick={() => togglePassword(user.id)}
                        className="users-password-toggle"
                        aria-label={showPasswords[user.id] ? "Sembunyikan password" : "Tampilkan password"}
                      >
                        <EyeIcon open={showPasswords[user.id]} />
                      </button>
                    </div>
                  </td>
                  <td className="admin-td">
                    <span className={`users-role-badge users-role-badge--${user.role}`}>
                      {user.role === "superadmin" ? "Super Admin" : "Admin"}
                    </span>
                  </td>
                  <td className="admin-td">
                    <span className={`users-status-badge users-status-badge--${user.aktif ? "aktif" : "nonaktif"}`}>
                      {user.aktif ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="admin-td users-date">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="admin-td admin-td--actions">
                    <button
                      className="admin-action-btn admin-action-btn--edit"
                      onClick={() => setEditingUser({ ...user })}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-action-btn admin-action-btn--delete"
                      onClick={() => setDeleteTarget(user)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-label="Edit pengguna">
          <div className="users-edit-modal">
            <div className="users-edit-modal-header">
              <h2 className="dialog-title" style={{ textAlign: "left", margin: 0 }}>Edit Pengguna</h2>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="users-edit-modal-close"
                aria-label="Tutup modal"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdate} className="admin-form" noValidate style={{ gap: "1rem" }}>
              <div className="form-field">
                <label className="form-label">Username</label>
                <p className="users-readonly-field">{editingUser.username}</p>
                <p className="form-hint">Username tidak dapat diubah.</p>
              </div>

              <div className="form-field">
                <label htmlFor="edit-nama" className="form-label">Nama Lengkap <span className="form-required">*</span></label>
                <input
                  id="edit-nama"
                  className="form-input"
                  value={editingUser.nama}
                  onChange={(e) => setEditingUser((prev) => prev ? { ...prev, nama: e.target.value } : null)}
                  placeholder="Nama tampil"
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-role" className="form-label">Role <span className="form-required">*</span></label>
                <select
                  id="edit-role"
                  className="form-select"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser((prev) => prev ? { ...prev, role: e.target.value as "admin" | "superadmin" } : null)}
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
                <p className="form-hint">Admin hanya bisa kelola konten. Super Admin bisa kelola pengguna juga.</p>
              </div>

              <div className="form-field">
                <label className="form-label">Status Akun</label>
                <label className="users-toggle-label">
                  <input
                    type="checkbox"
                    checked={editingUser.aktif}
                    onChange={(e) => setEditingUser((prev) => prev ? { ...prev, aktif: e.target.checked } : null)}
                    className="users-toggle-input"
                  />
                  <span className="users-toggle-track">
                    <span className="users-toggle-thumb" />
                  </span>
                  <span className="users-toggle-text">{editingUser.aktif ? "Akun Aktif" : "Akun Nonaktif"}</span>
                </label>
                <p className="form-hint">Akun nonaktif tidak bisa login ke panel admin.</p>
              </div>

              <div className="form-field">
                <label className="form-label">Password</label>
                <p className="users-readonly-field">{editingUser.password}</p>
                <p className="form-hint">⚠ Password tidak dapat diubah melalui form ini (API tidak mendukung update password langsung). Untuk ganti password, hapus akun lama dan buat baru.</p>
              </div>

              {error && (
                <div className="admin-alert admin-alert--error" role="alert">{error}</div>
              )}

              <div className="admin-form-actions" style={{ paddingTop: "0.5rem", borderTop: "1px solid var(--color-border)" }}>
                <button
                  type="button"
                  onClick={() => { setEditingUser(null); setError(null); }}
                  className="admin-btn admin-btn--ghost"
                  disabled={isSaving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                  disabled={isSaving}
                  id="user-edit-submit-btn"
                >
                  {isSaving ? (
                    <>
                      <div className="admin-spinner admin-spinner--sm" />
                      Menyimpan...
                    </>
                  ) : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Pengguna"
        message={`Yakin ingin menghapus akun "${deleteTarget?.nama}" (@${deleteTarget?.username})? Tindakan ini tidak dapat dibatalkan dan akun tidak bisa login lagi.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
