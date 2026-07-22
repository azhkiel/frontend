"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { deleteUser } from "@/lib/api";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { User } from "@/lib/types";

// Catatan: tidak ada getUsers endpoint di API publik, 
// sehingga halaman ini menampilkan pesan panduan
// dan hanya bisa create/edit/delete user.
export default function AdminUsersPage() {
  const router = useRouter();
  const { session, isReady } = useAdminGuard("superadmin");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Karena tidak ada getUsers endpoint, kita tampilkan UI untuk manage users
  // tapi data list tidak tersedia dari API. Hanya bisa tambah dan edit by ID.

  if (!isReady) return null;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pengguna</h1>
          <p className="admin-page-subtitle">Kelola akun admin. Hanya superadmin yang bisa mengakses menu ini.</p>
        </div>
        <button onClick={() => router.push("/admin/users/tambah")} className="admin-btn admin-btn--primary" id="users-tambah-btn">
          + Tambah Pengguna
        </button>
      </div>

      {error && <div className="admin-alert admin-alert--error" role="alert">{error}</div>}

      <div className="admin-info-box">
        <div className="admin-info-box-icon">ℹ️</div>
        <div>
          <p className="font-semibold text-sm mb-1">Catatan API</p>
          <p className="text-sm text-text-secondary">
            API backend tidak menyediakan endpoint <code>getUsers</code> untuk list semua pengguna.
            Gunakan tombol <strong>Tambah Pengguna</strong> untuk membuat akun baru, atau
            hubungi superadmin lain untuk mendapatkan ID pengguna yang ingin diedit.
          </p>
        </div>
      </div>
    </div>
  );
}
