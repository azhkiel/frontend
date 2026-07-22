// ============================================================
// API WRAPPER — Website Desa Kedungpari
// Base URL: NEXT_PUBLIC_API_URL (Google Apps Script Web App)
//
// POST: header "Content-Type: text/plain;charset=utf-8" wajib
// agar tidak trigger preflight OPTIONS yang tidak didukung
// Apps Script. Body tetap JSON string.
// ============================================================

import type {
  Profil, Berita, Potensi, Galeri, StrukturOrganisasi, Statistik,
  User, AuthSession, ApiWriteResponse, ApiUploadResponse,
  BeritaQueryParams, PotensiQueryParams, GaleriQueryParams,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

if (!BASE_URL && typeof window === "undefined") {
  console.warn("[api] NEXT_PUBLIC_API_URL tidak diset. Semua fetch akan gagal.");
}

// ============================================================
// Transport helpers
// ============================================================

/** GET request — action lewat query string */
async function apiFetch<T>(action: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(BASE_URL);
  url.searchParams.set("action", action);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

  const json = await res.json();
  if (json && typeof json === "object" && "error" in json) {
    throw new Error(json.error as string);
  }
  return json as T;
}

/** POST request — body JSON, header text/plain untuk bypass CORS preflight */
async function apiPost<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

  const json = await res.json();
  if (json && typeof json === "object" && "error" in json) {
    throw new Error(json.error as string);
  }
  return json as T;
}

// ============================================================
// 1. Endpoint Publik (GET)
// ============================================================

export async function getProfil(): Promise<Profil> {
  return apiFetch<Profil>("getProfil");
}

export async function getStatistik(): Promise<Statistik> {
  return apiFetch<Statistik>("getStatistik");
}

export async function getBerita(params?: BeritaQueryParams): Promise<Berita[]> {
  const p: Record<string, string> = {};
  if (params?.kategori) p.kategori = params.kategori;
  if (params?.sortBy)   p.sortBy   = params.sortBy;
  if (params?.limit)    p.limit    = String(params.limit);
  if (params?.offset)   p.offset   = String(params.offset);
  return apiFetch<Berita[]>("getBerita", p);
}

export async function getBeritaById(id: string): Promise<Berita | null> {
  return apiFetch<Berita | null>("getBeritaById", { id });
}

export async function getBeritaBySlug(slug: string): Promise<Berita | null> {
  return apiFetch<Berita | null>("getBeritaBySlug", { slug });
}

export async function getPotensi(params?: PotensiQueryParams): Promise<Potensi[]> {
  const p: Record<string, string> = {};
  if (params?.kategori) p.kategori = params.kategori;
  return apiFetch<Potensi[]>("getPotensi", p);
}

export async function getPotensiById(id: string): Promise<Potensi | null> {
  return apiFetch<Potensi | null>("getPotensiById", { id });
}

export async function getGaleri(params?: GaleriQueryParams): Promise<Galeri[]> {
  const p: Record<string, string> = {};
  if (params?.tipe) p.tipe = params.tipe;
  return apiFetch<Galeri[]>("getGaleri", p);
}

export async function getGaleriById(id: string): Promise<Galeri | null> {
  return apiFetch<Galeri | null>("getGaleriById", { id });
}

export async function getStruktur(): Promise<StrukturOrganisasi[]> {
  return apiFetch<StrukturOrganisasi[]>("getStruktur");
}

export async function getStrukturById(id: string): Promise<StrukturOrganisasi | null> {
  return apiFetch<StrukturOrganisasi | null>("getStrukturById", { id });
}

// ============================================================
// 2. Autentikasi (POST)
// ============================================================

export async function login(username: string, password: string): Promise<AuthSession> {
  return apiPost<AuthSession>({ action: "login", username, password });
}

export async function logout(sessionToken: string): Promise<{ success: boolean }> {
  return apiPost<{ success: boolean }>({ action: "logout", sessionToken });
}

// ============================================================
// 3. CRUD Admin — Berita
// ============================================================

export type CreateBeritaData = Omit<Berita, "id">;
export type UpdateBeritaData = Partial<Omit<Berita, "id">> & { id: string };

export async function createBerita(
  sessionToken: string,
  data: CreateBeritaData
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "createBerita", sessionToken, data });
}

export async function updateBerita(
  sessionToken: string,
  data: UpdateBeritaData
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "updateBerita", sessionToken, data });
}

export async function deleteBerita(
  sessionToken: string,
  id: string
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "deleteBerita", sessionToken, data: { id } });
}

// ============================================================
// 4. CRUD Admin — Potensi
// ============================================================

export type CreatePotensiData = Omit<Potensi, "id">;
export type UpdatePotensiData = Partial<Omit<Potensi, "id">> & { id: string };

export async function createPotensi(
  sessionToken: string,
  data: CreatePotensiData
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "createPotensi", sessionToken, data });
}

export async function updatePotensi(
  sessionToken: string,
  data: UpdatePotensiData
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "updatePotensi", sessionToken, data });
}

export async function deletePotensi(
  sessionToken: string,
  id: string
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "deletePotensi", sessionToken, data: { id } });
}

// ============================================================
// 5. CRUD Admin — Galeri
// ============================================================

export type CreateGaleriData = Omit<Galeri, "id">;
export type UpdateGaleriData = Partial<Omit<Galeri, "id">> & { id: string };

export async function createGaleri(
  sessionToken: string,
  data: CreateGaleriData
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "createGaleri", sessionToken, data });
}

export async function updateGaleri(
  sessionToken: string,
  data: UpdateGaleriData
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "updateGaleri", sessionToken, data });
}

export async function deleteGaleri(
  sessionToken: string,
  id: string
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "deleteGaleri", sessionToken, data: { id } });
}

// ============================================================
// 6. CRUD Admin — Struktur Organisasi
// ============================================================

export type CreateStrukturData = Omit<StrukturOrganisasi, "id">;
export type UpdateStrukturData = Partial<Omit<StrukturOrganisasi, "id">> & { id: string };

export async function createStruktur(
  sessionToken: string,
  data: CreateStrukturData
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "createStruktur", sessionToken, data });
}

export async function updateStruktur(
  sessionToken: string,
  data: UpdateStrukturData
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "updateStruktur", sessionToken, data });
}

export async function deleteStruktur(
  sessionToken: string,
  id: string
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "deleteStruktur", sessionToken, data: { id } });
}

// ============================================================
// 7. Update Profil & Statistik (single-row)
// ============================================================

export async function updateProfil(
  sessionToken: string,
  data: Partial<Profil> & { id: "main" }
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "updateProfil", sessionToken, data });
}

export async function updateStatistik(
  sessionToken: string,
  data: Partial<Statistik> & { id: string }
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "updateStatistik", sessionToken, data });
}

// ============================================================
// 8. CRUD Admin — Users (superadmin only)
// ============================================================

export interface CreateUserData {
  username: string;
  password: string;
  nama: string;
  role?: "admin" | "superadmin";
}

export interface UpdateUserData {
  id: string;
  nama?: string;
  role?: "admin" | "superadmin";
  aktif?: boolean;
}

export async function createUser(
  sessionToken: string,
  data: CreateUserData
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "createUsers", sessionToken, data });
}

export async function updateUser(
  sessionToken: string,
  data: UpdateUserData
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "updateUsers", sessionToken, data });
}

export async function deleteUser(
  sessionToken: string,
  id: string
): Promise<ApiWriteResponse> {
  return apiPost<ApiWriteResponse>({ action: "deleteUsers", sessionToken, data: { id } });
}

// ============================================================
// 9. Upload Gambar
// ============================================================

export type UploadFolder = "BERITA" | "POTENSI" | "GALERI" | "STRUKTUR" | "PROFIL";

export interface UploadGambarData {
  base64: string;
  fileName?: string;
  mimeType?: string;
  folder?: UploadFolder;
}

export async function uploadGambar(
  sessionToken: string,
  data: UploadGambarData
): Promise<ApiUploadResponse> {
  return apiPost<ApiUploadResponse>({ action: "uploadGambar", sessionToken, data });
}
