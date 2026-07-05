// ============================================================
// TYPES — Website Desa Kedungpari
// Cermin skema Google Sheets §4 dari Skill.md
// ============================================================

export interface Profil {
  id: "main";
  namaDesa: string;
  namaKecamatan: string;
  namaKabupaten: string;
  sejarahSingkat: string;
  visi: string;
  misi: string;          // poin-poin dipisah "\n"
  luasWilayah: number;   // dalam km²
  jumlahDusun: number;
  logoUrl: string;
  heroImageUrl: string;
}

export type KategoriBerita = "Pengumuman" | "Kegiatan" | "Pembangunan" | "Lainnya";

export interface Berita {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string;
  isi: string;           // markdown sederhana
  gambarUrl: string;
  tanggal: string;       // "YYYY-MM-DD"
  penulis: string;
  kategori: KategoriBerita;
}

export type KategoriPotensi = "UMKM" | "Wisata" | "Produk Unggulan";

export interface Potensi {
  id: string;
  nama: string;
  kategori: KategoriPotensi;
  deskripsi: string;
  gambarUrl: string;
  kontak?: string;
  lokasi: string;
}

export type TipeGaleri = "foto" | "video";

export interface Galeri {
  id: string;
  judul: string;
  tipe: TipeGaleri;
  url: string;
  thumbnailUrl: string;
  tanggal: string;
}

export interface StrukturOrganisasi {
  id: string;
  nama: string;
  jabatan: string;
  fotoUrl: string;
  noHp?: string;
  urutan: number;
}

export interface Statistik {
  id: string;
  jumlahPenduduk: number;
  jumlahKK: number;
  jumlahLakiLaki: number;
  jumlahPerempuan: number;
  latitude: number;
  longitude: number;
  tahunData: number;
}

// ============================================================
// Helper types untuk response API
// ============================================================

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface BeritaQueryParams {
  kategori?: KategoriBerita;
  limit?: number;
  offset?: number;
}

export interface PotensiQueryParams {
  kategori?: KategoriPotensi;
}
