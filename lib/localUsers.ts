// ============================================================
// LOCAL USERS STORE — Website Desa
// Workaround karena API tidak memiliki getUsers endpoint.
// Data user disimpan di localStorage saat create,
// agar dapat ditampilkan di halaman manajemen pengguna.
// ============================================================

const LOCAL_USERS_KEY = "desa_local_users";

export interface LocalUser {
  id: string;
  username: string;
  nama: string;
  role: "admin" | "superadmin";
  password: string; // plaintext saat input, bukan hash
  aktif: boolean;
  createdAt: string;
}

export function getLocalUsers(): LocalUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveLocalUsers(users: LocalUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export function saveLocalUser(user: LocalUser) {
  const users = getLocalUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  saveLocalUsers(users);
}

export function removeLocalUser(id: string) {
  const users = getLocalUsers().filter((u) => u.id !== id);
  saveLocalUsers(users);
}
