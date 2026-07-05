// DUMMY DATA — ganti sebelum go-live
// Konteks: Desa Kedungpari, Kec. Mojowarno, Kab. Jombang, Jawa Timur

import type {
  Profil, Berita, Potensi, Galeri, StrukturOrganisasi, Statistik,
} from "./types";

// ============================================================
// IMAGE HELPERS — Unsplash images.unsplash.com (CDN, no deprecated source.unsplash.com)
// ============================================================

// Foto hero: sawah & desa Jawa Timur
const getHeroImage = () =>
  "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=1600&q=80&fit=crop";

const getLogo = () => "https://placehold.co/200x200/2F5233/FFFFFF?text=Logo+Desa";

const getAvatar = (nama: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=2F5233&color=fff&size=128`;

// Foto berita: Unsplash photo ID tetap (reliable)
const BERITA_IMAGES: Record<string, string> = {
  "brt-001": "https://images.unsplash.com/photo-1541697418629-c4bc3b4cac3e?w=800&q=75&fit=crop", // rapat desa
  "brt-002": "https://images.unsplash.com/photo-1500595046743-cd271d694e30?w=800&q=75&fit=crop", // panen padi
  "brt-003": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=75&fit=crop", // konstruksi
  "brt-004": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=75&fit=crop", // kerajinan tangan
  "brt-005": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=75&fit=crop", // kesehatan
  "brt-006": "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=75&fit=crop", // festival budaya
};

// Foto potensi: Unsplash photo ID tetap
const POTENSI_IMAGES: Record<string, string> = {
  "pot-001": "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=75&fit=crop", // kerajinan manik
  "pot-002": "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=75&fit=crop", // embung/waduk
  "pot-003": "https://images.unsplash.com/photo-1500595046743-cd271d694e30?w=600&q=75&fit=crop", // pertanian padi
  "pot-004": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=75&fit=crop", // tempe/makanan tradisional
  "pot-005": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75&fit=crop", // batik kain
};

// Foto galeri: Unsplash photo ID tetap
const GALERI_IMAGES: { url: string; thumb: string }[] = [
  {
    url: "https://images.unsplash.com/photo-1559562723-e5085ae59e60?w=800&q=75&fit=crop",
    thumb: "https://images.unsplash.com/photo-1559562723-e5085ae59e60?w=400&q=70&fit=crop",
  }, // balai desa
  {
    url: "https://images.unsplash.com/photo-1500595046743-cd271d694e30?w=800&q=75&fit=crop",
    thumb: "https://images.unsplash.com/photo-1500595046743-cd271d694e30?w=400&q=70&fit=crop",
  }, // panen padi
  {
    url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=75&fit=crop",
    thumb: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=70&fit=crop",
  }, // embung
  {
    url: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=75&fit=crop",
    thumb: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400&q=70&fit=crop",
  }, // festival
  {
    url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=75&fit=crop",
    thumb: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=70&fit=crop",
  }, // pelatihan kerajinan
  {
    url: "https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=800&q=75&fit=crop",
    thumb: "https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=400&q=70&fit=crop",
  }, // gotong royong
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=75&fit=crop",
    thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70&fit=crop",
  }, // sawah hijau
  {
    url: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&q=75&fit=crop",
    thumb: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=400&q=70&fit=crop",
  }, // kirab budaya
];

// ============================================================
// PROFIL DESA
// ============================================================
export const DUMMY_PROFIL: Profil = {
  id: "main",
  namaDesa: "Kedungpari",
  namaKecamatan: "Mojowarno",
  namaKabupaten: "Jombang",
  sejarahSingkat:
    "Desa Kedungpari berdiri sekitar abad ke-19, berasal dari kata Sumber (mata air) dan Agung (besar/mulia), merujuk pada sumber air alami yang menghidupi lahan pertanian warga. Dahulu merupakan kawasan hutan jati yang dibuka oleh para leluhur dari Kerajaan Majapahit yang berimigrasi ke wilayah Jombang. Desa ini dikenal sebagai penghasil manik-manik kaca dan sentra pertanian padi-tebu yang menjadi tulang punggung ekonomi warga.",
  visi: "Mewujudkan Desa Kedungpari yang maju, mandiri, dan berbudaya berlandaskan nilai-nilai kearifan lokal.",
  misi:
    "Meningkatkan kualitas layanan publik yang transparan dan akuntabel.\nMengembangkan potensi ekonomi lokal berbasis pertanian dan UMKM.\nMemperkuat partisipasi warga dalam pembangunan desa.\nMelestarikan budaya dan tradisi lokal sebagai identitas desa.\nMeningkatkan kualitas infrastruktur dan lingkungan hidup yang berkelanjutan.",
  luasWilayah: 4.87,
  jumlahDusun: 3,
  logoUrl: getLogo(),
  heroImageUrl: getHeroImage(),
};

// ============================================================
// BERITA
// ============================================================
export const DUMMY_BERITA: Berita[] = [
  {
    id: "brt-001",
    slug: "musyawarah-rencana-pembangunan-2025",
    judul: "Musyawarah Rencana Pembangunan Desa Tahun 2025",
    ringkasan:
      "Seluruh perangkat desa dan perwakilan warga hadir dalam Musrenbangdes untuk menentukan prioritas pembangunan infrastruktur jalan dan irigasi tahun anggaran 2025.",
    isi: `## Musyawarah Rencana Pembangunan Desa 2025

Pada tanggal 15 Januari 2025, Balai Desa Kedungpari menjadi tempat berlangsungnya Musyawarah Rencana Pembangunan Desa (Musrenbangdes) Tahun Anggaran 2025. Kegiatan ini dihadiri oleh Kepala Desa, seluruh perangkat desa, Ketua BPD, dan perwakilan warga dari tiga dusun.

### Agenda Utama

Beberapa prioritas pembangunan yang disepakati bersama antara lain:
- Rehabilitasi jalan desa sepanjang 1,2 km di Dusun Krajan
- Pembangunan saluran irigasi untuk lahan pertanian Dusun Kedungpari Lor
- Pengadaan lampu jalan tenaga surya di Dusun Kemiri

Kepala Desa Bapak Sukarman menyampaikan bahwa seluruh usulan akan diajukan ke Kecamatan Mojowarno untuk mendapat persetujuan anggaran.`,
    gambarUrl: BERITA_IMAGES["brt-001"],
    tanggal: "2025-01-15",
    penulis: "Sekretaris Desa",
    kategori: "Pengumuman",
  },
  {
    id: "brt-002",
    slug: "panen-raya-padi-dusun-kemiri",
    judul: "Panen Raya Padi di Dusun Kemiri, Hasil Meningkat 18%",
    ringkasan:
      "Kelompok Tani Sumber Makmur berhasil meningkatkan hasil panen padi varietas Ciherang sebesar 18% berkat penerapan sistem tanam jajar legowo.",
    isi: `## Panen Raya di Dusun Kemiri

Kelompok Tani Sumber Makmur yang beranggotakan 34 petani dari Dusun Kemiri menggelar panen raya pada pertengahan Februari 2025. Hasil panen musim ini mencapai **6,8 ton per hektar**, meningkat 18% dibanding tahun lalu yang hanya 5,7 ton per hektar.

Peningkatan ini berkat pendampingan dari Dinas Pertanian Kabupaten Jombang yang menerapkan sistem tanam **jajar legowo 2:1** serta penggunaan pupuk organik kompos dari limbah tebu milik warga setempat.`,
    gambarUrl: BERITA_IMAGES["brt-002"],
    tanggal: "2025-02-18",
    penulis: "Kaur Kesejahteraan",
    kategori: "Kegiatan",
  },
  {
    id: "brt-003",
    slug: "pembangunan-talud-penahan-tanah-lor",
    judul: "Pembangunan Talud Penahan Tanah Dusun Kedungpari Lor Dimulai",
    ringkasan:
      "Proyek pembangunan talud sepanjang 120 meter di Dusun Kedungpari Lor resmi dimulai menggunakan Dana Desa 2025 untuk mencegah longsor di lahan pertanian warga.",
    isi: `## Pembangunan Talud Penahan Tanah

Proyek pembangunan talud penahan tanah di Dusun Kedungpari Lor resmi dimulai pada 3 Maret 2025 setelah anggaran dari Dana Desa 2025 sebesar Rp 187.500.000 dicairkan.

Talud sepanjang 120 meter dan tinggi 2,5 meter ini dibangun untuk mengatasi masalah longsor tanah yang sering terjadi di tepi sungai kecil yang berbatasan dengan lahan pertanian warga.`,
    gambarUrl: BERITA_IMAGES["brt-003"],
    tanggal: "2025-03-03",
    penulis: "Kaur Pembangunan",
    kategori: "Pembangunan",
  },
  {
    id: "brt-004",
    slug: "pelatihan-manik-manik-untuk-ibu-pkk",
    judul: "Pelatihan Produksi Manik-Manik Kaca untuk Ibu-Ibu PKK",
    ringkasan:
      "Dinas Perindustrian Kabupaten Jombang mengadakan pelatihan produksi manik-manik kaca di Balai Desa Kedungpari untuk 25 ibu-ibu anggota PKK.",
    isi: `## Pelatihan Manik-Manik Kaca

Dinas Perindustrian dan Perdagangan Kabupaten Jombang bekerja sama dengan Pemerintah Desa Kedungpari menggelar pelatihan produksi manik-manik kaca pada 20–22 Maret 2025 di Balai Desa.

Sebanyak **25 ibu-ibu anggota PKK** mengikuti pelatihan selama tiga hari penuh, mulai dari pemilihan bahan baku kaca, teknik pembentukan, pewarnaan, hingga pengemasan untuk keperluan ekspor.`,
    gambarUrl: BERITA_IMAGES["brt-004"],
    tanggal: "2025-03-22",
    penulis: "Ketua PKK Desa",
    kategori: "Kegiatan",
  },
  {
    id: "brt-005",
    slug: "pengumuman-jadwal-posyandu-april-2025",
    judul: "Jadwal Posyandu Balita dan Lansia April 2025",
    ringkasan:
      "Posyandu Melati I dan II serta Posyandu Lansia Sehat akan digelar serentak pada minggu pertama April 2025 di tiga dusun.",
    isi: `## Jadwal Posyandu April 2025

Kepada seluruh warga Desa Kedungpari, berikut jadwal Posyandu Balita dan Lansia bulan April 2025.

Harap membawa Buku KIA untuk balita dan Buku Kesehatan Lansia. Pemeriksaan gratis meliputi penimbangan, pengukuran tinggi badan, dan konsultasi gizi.`,
    gambarUrl: BERITA_IMAGES["brt-005"],
    tanggal: "2025-04-01",
    penulis: "Bidan Desa",
    kategori: "Pengumuman",
  },
  {
    id: "brt-006",
    slug: "festival-bersih-desa-Kedungpari-2025",
    judul: "Festival Bersih Desa Kedungpari 2025 Meriah Dihadiri Ribuan Warga",
    ringkasan:
      "Tradisi tahunan Bersih Desa digelar dengan kirab budaya, pertunjukan reog, dan pasar rakyat yang dihadiri lebih dari 2.000 warga dari berbagai dusun.",
    isi: `## Festival Bersih Desa 2025

Desa Kedungpari kembali menggelar tradisi tahunan **Bersih Desa** pada 12 April 2025 dengan serangkaian acara yang meriah. Lebih dari 2.000 warga dari tiga dusun hadir menyaksikan kirab budaya yang menampilkan gunungan hasil bumi, tari-tarian tradisional, dan pertunjukan Reog Ponorogo.`,
    gambarUrl: BERITA_IMAGES["brt-006"],
    tanggal: "2025-04-14",
    penulis: "Kaur Kesejahteraan",
    kategori: "Kegiatan",
  },
];

// ============================================================
// POTENSI DESA
// ============================================================
export const DUMMY_POTENSI: Potensi[] = [
  {
    id: "pot-001",
    nama: "UD. Manik-Manik Kaca Kedungpari",
    kategori: "UMKM",
    deskripsi:
      "Usaha kerajinan manik-manik kaca rumahan yang telah berdiri sejak 1987. Memproduksi manik-manik beraneka warna untuk kebutuhan aksesori, gelang, kalung, dan hiasan. Produk dipasarkan ke Surabaya, Bali, dan mulai merambah pasar ekspor ke Malaysia.",
    gambarUrl: POTENSI_IMAGES["pot-001"],
    kontak: "081234567890",
    lokasi: "Dusun Krajan, RT 02/RW 01",
  },
  {
    id: "pot-002",
    nama: "Embung Tirta Agung",
    kategori: "Wisata",
    deskripsi:
      "Embung (waduk kecil) seluas 2,3 hektar yang menjadi spot wisata alam sekaligus sumber irigasi utama desa. Pengunjung dapat memancing, bersepeda di sekitar embung, dan menikmati pemandangan sawah hijau khas Jombang. Pengelolaan dilakukan oleh Karang Taruna Desa.",
    gambarUrl: POTENSI_IMAGES["pot-002"],
    kontak: "082345678901",
    lokasi: "Dusun Kedungpari Lor",
  },
  {
    id: "pot-003",
    nama: "Kelompok Tani Sumber Makmur",
    kategori: "UMKM",
    deskripsi:
      "Kelompok tani beranggotakan 34 petani yang mengelola lahan pertanian padi dan tebu seluas 47 hektar. Menggunakan metode pertanian organik semi-intensif dengan sistem jajar legowo. Hasil panen dipasarkan ke penggilingan padi di Mojowarno dan pabrik gula Djombang Baru.",
    gambarUrl: POTENSI_IMAGES["pot-003"],
    kontak: "083456789012",
    lokasi: "Dusun Kemiri & Dusun Kedungpari Lor",
  },
  {
    id: "pot-004",
    nama: "Tempe Kedelai Pak Darmaji",
    kategori: "Produk Unggulan",
    deskripsi:
      "Produksi tempe kedelai lokal yang sudah dikenal di pasar Mojowarno sejak tiga generasi. Menggunakan kedelai lokal pilihan dan proses fermentasi tradisional selama 36 jam. Produksi harian mencapai 150 kg tempe, dijual di pasar kecamatan dan warung-warung sekitar desa.",
    gambarUrl: POTENSI_IMAGES["pot-004"],
    kontak: "084567890123",
    lokasi: "Dusun Krajan, RT 05/RW 02",
  },
  {
    id: "pot-005",
    nama: "Batik Tulis Motif Jombangan",
    kategori: "Produk Unggulan",
    deskripsi:
      "Kelompok pengrajin batik tulis yang mengangkat motif khas Jombang — bambu runcing dan bunga tebu — sebagai identitas lokal. Diproduksi oleh 8 pengrajin perempuan, batik ini mulai dipasarkan ke pameran UMKM tingkat kabupaten.",
    gambarUrl: POTENSI_IMAGES["pot-005"],
    kontak: "085678901234",
    lokasi: "Dusun Kemiri, RT 03/RW 02",
  },
];

// ============================================================
// GALERI
// ============================================================
export const DUMMY_GALERI: Galeri[] = [
  { id: "gal-001", judul: "Balai Desa Kedungpari", tipe: "foto", url: GALERI_IMAGES[0].url, thumbnailUrl: GALERI_IMAGES[0].thumb, tanggal: "2025-01-10" },
  { id: "gal-002", judul: "Panen Raya Padi Dusun Kemiri", tipe: "foto", url: GALERI_IMAGES[1].url, thumbnailUrl: GALERI_IMAGES[1].thumb, tanggal: "2025-02-18" },
  { id: "gal-003", judul: "Embung Tirta Agung", tipe: "foto", url: GALERI_IMAGES[2].url, thumbnailUrl: GALERI_IMAGES[2].thumb, tanggal: "2025-02-25" },
  { id: "gal-004", judul: "Festival Bersih Desa 2025", tipe: "foto", url: GALERI_IMAGES[3].url, thumbnailUrl: GALERI_IMAGES[3].thumb, tanggal: "2025-04-12" },
  { id: "gal-005", judul: "Pelatihan Manik-Manik PKK", tipe: "foto", url: GALERI_IMAGES[4].url, thumbnailUrl: GALERI_IMAGES[4].thumb, tanggal: "2025-03-20" },
  { id: "gal-006", judul: "Gotong Royong Bersih Dusun", tipe: "foto", url: GALERI_IMAGES[5].url, thumbnailUrl: GALERI_IMAGES[5].thumb, tanggal: "2025-03-15" },
  { id: "gal-007", judul: "Sawah Hijau Kedungpari Lor", tipe: "foto", url: GALERI_IMAGES[6].url, thumbnailUrl: GALERI_IMAGES[6].thumb, tanggal: "2025-01-28" },
  { id: "gal-008", judul: "Kirab Budaya Bersih Desa", tipe: "foto", url: GALERI_IMAGES[7].url, thumbnailUrl: GALERI_IMAGES[7].thumb, tanggal: "2025-04-12" },
];

// ============================================================
// STRUKTUR ORGANISASI
// ============================================================
export const DUMMY_STRUKTUR: StrukturOrganisasi[] = [
  { id: "str-001", nama: "Sukarman", jabatan: "Kepala Desa", fotoUrl: getAvatar("Sukarman"), noHp: "081234500001", urutan: 1 },
  { id: "str-002", nama: "Endang Rahayu, S.Pd.", jabatan: "Sekretaris Desa", fotoUrl: getAvatar("Endang Rahayu"), noHp: "081234500002", urutan: 2 },
  { id: "str-003", nama: "Suroto", jabatan: "Kaur Keuangan", fotoUrl: getAvatar("Suroto"), urutan: 3 },
  { id: "str-004", nama: "Dwi Lestari", jabatan: "Kaur Perencanaan", fotoUrl: getAvatar("Dwi Lestari"), urutan: 4 },
  { id: "str-005", nama: "Mulyono", jabatan: "Kasi Pemerintahan", fotoUrl: getAvatar("Mulyono"), urutan: 5 },
  { id: "str-006", nama: "Siti Aminah", jabatan: "Kasi Kesejahteraan", fotoUrl: getAvatar("Siti Aminah"), urutan: 6 },
  { id: "str-007", nama: "Bambang Widodo", jabatan: "Kasun Krajan", fotoUrl: getAvatar("Bambang Widodo"), noHp: "081234500007", urutan: 7 },
  { id: "str-008", nama: "Heri Prasetyo", jabatan: "Kasun Kemiri", fotoUrl: getAvatar("Heri Prasetyo"), noHp: "081234500008", urutan: 8 },
  { id: "str-009", nama: "Slamet Riyadi", jabatan: "Kasun Kedungpari Lor", fotoUrl: getAvatar("Slamet Riyadi"), noHp: "081234500009", urutan: 9 },
];

// ============================================================
// STATISTIK
// ============================================================
export const DUMMY_STATISTIK: Statistik = {
  id: "statistik-main",
  jumlahPenduduk: 4237,
  jumlahKK: 1142,
  jumlahLakiLaki: 2103,
  jumlahPerempuan: 2134,
  latitude: -7.6541,
  longitude: 112.3217,
  tahunData: 2024,
};
