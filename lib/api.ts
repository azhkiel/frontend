// ============================================================
// API WRAPPER — Website Desa Kedungpari
// Fetch ke Apps Script Web App; fallback ke dummy data jika
// NEXT_PUBLIC_APPS_SCRIPT_URL tidak diset (mode development).
// ============================================================

import type {
  Profil, Berita, Potensi, Galeri,
  StrukturOrganisasi, Statistik,
  BeritaQueryParams, PotensiQueryParams,
} from "./types";

import {
  DUMMY_PROFIL, DUMMY_BERITA, DUMMY_POTENSI,
  DUMMY_GALERI, DUMMY_STRUKTUR, DUMMY_STATISTIK,
} from "./dummy-data";

const BASE_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? "";
const IS_DEV   = !BASE_URL;

async function apiFetch<T>(action: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(BASE_URL);
  url.searchParams.set("action", action);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json as T;
}

// ============================================================
export async function getProfil(): Promise<Profil> {
  if (IS_DEV) return DUMMY_PROFIL;
  return apiFetch<Profil>("getProfil");
}

export async function getBerita(params?: BeritaQueryParams): Promise<Berita[]> {
  if (IS_DEV) {
    let data = [...DUMMY_BERITA];
    if (params?.kategori) data = data.filter(b => b.kategori === params.kategori);
    if (params?.limit) data = data.slice(params.offset ?? 0, (params.offset ?? 0) + params.limit);
    return data;
  }
  const p: Record<string, string> = {};
  if (params?.kategori) p.kategori = params.kategori;
  if (params?.limit)    p.limit    = String(params.limit);
  if (params?.offset)   p.offset   = String(params.offset);
  return apiFetch<Berita[]>("getBerita", p);
}

export async function getBeritaBySlug(slug: string): Promise<Berita | null> {
  if (IS_DEV) return DUMMY_BERITA.find(b => b.slug === slug) ?? null;
  const all = await apiFetch<Berita[]>("getBerita");
  return all.find(b => b.slug === slug) ?? null;
}

export async function getPotensi(params?: PotensiQueryParams): Promise<Potensi[]> {
  if (IS_DEV) {
    let data = [...DUMMY_POTENSI];
    if (params?.kategori) data = data.filter(p => p.kategori === params.kategori);
    return data;
  }
  const p: Record<string, string> = {};
  if (params?.kategori) p.kategori = params.kategori;
  return apiFetch<Potensi[]>("getPotensi", p);
}

export async function getGaleri(): Promise<Galeri[]> {
  if (IS_DEV) return DUMMY_GALERI;
  return apiFetch<Galeri[]>("getGaleri");
}

export async function getStruktur(): Promise<StrukturOrganisasi[]> {
  if (IS_DEV) return [...DUMMY_STRUKTUR].sort((a, b) => a.urutan - b.urutan);
  return apiFetch<StrukturOrganisasi[]>("getStruktur");
}

export async function getStatistik(): Promise<Statistik> {
  if (IS_DEV) return DUMMY_STATISTIK;
  return apiFetch<Statistik>("getStatistik");
}
