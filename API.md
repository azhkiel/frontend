# Dokumentasi API — Website Desa (Backend Apps Script)

Base URL semua endpoint di bawah adalah **Web App URL** hasil deploy dari Apps Script,

```
https://script.google.com/macros/s/AKfycbwnaScz-x7dL6VJ6S1_5vjqeThIqkZr3MKvVAeAnQKeQKfs7nE8k-X4FphztxoSmeWdug/exec
```

Selanjutnya disingkat `{WEB_APP_URL}`.

## Format umum

- **Read (publik)** → `GET`, action dikirim lewat query string `?action=...`.
- **Write (login, CRUD admin, upload)** → `POST`, body berupa JSON string,
  `action` wajib ada di body.
- Semua response berupa **JSON**, `Content-Type: application/json`.
- Response error selalu berbentuk `{ "error": "pesan error" }` — cek key
  `error` di FE sebelum pakai datanya.
- Aksi tulis (create/update/delete/upload) **wajib** menyertakan
  `sessionToken` hasil login. Tanpa itu akan dapat:
  ```json
  { "error": "Sesi tidak valid, silakan login ulang" }
  ```

### Catatan kirim POST dari browser (hindari CORS issue)

Apps Script Web App sering bermasalah dengan preflight CORS kalau fetch
pakai header `Content-Type: application/json`. Cara aman:

```javascript
fetch(WEB_APP_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // bukan application/json
  body: JSON.stringify({ action: 'login', username, password }),
});
```

Body tetap JSON string, hanya header `Content-Type`-nya yang di-"akali" jadi
`text/plain` supaya browser tidak mengirim preflight `OPTIONS` (yang tidak
didukung baik oleh Apps Script).

---

## 1. Endpoint Publik (GET, tanpa login)

### `getProfil`
Ambil data profil desa (single-row).

```
GET {WEB_APP_URL}?action=getProfil
```

**Response**
```json
{
  "id": "main",
  "namaDesa": "Desa Sumbermulyo",
  "namaKecamatan": "Kecamatan Jogoroto, Kabupaten Jombang",
  "sejarahSingkat": "...",
  "visi": "...",
  "misi": "Poin 1\nPoin 2\nPoin 3",
  "luasWilayah": 4.8,
  "jumlahDusun": 4,
  "logoUrl": "https://drive.google.com/uc?export=view&id=...",
  "heroImageUrl": "https://drive.google.com/uc?export=view&id=..."
}
```

### `getStatistik`
Ambil data statistik & koordinat peta (single-row).

```
GET {WEB_APP_URL}?action=getStatistik
```

**Response**
```json
{
  "id": "main",
  "jumlahPenduduk": 4218,
  "jumlahKK": 1187,
  "jumlahLakiLaki": 2109,
  "jumlahPerempuan": 2109,
  "latitude": -7.546,
  "longitude": 112.2384,
  "tahunData": 2026
}
```

### `getBerita`
Daftar berita. Mendukung filter & sort lewat query string tambahan.

```
GET {WEB_APP_URL}?action=getBerita
GET {WEB_APP_URL}?action=getBerita&kategori=Pengumuman
GET {WEB_APP_URL}?action=getBerita&sortBy=tanggal&limit=5
```

| Query param | Keterangan |
|---|---|
| `kategori` | filter exact-match, mis. `Pengumuman`, `Kegiatan`, `Pembangunan`, `Lainnya` |
| `sortBy` | nama kolom untuk sort ascending, mis. `tanggal` |
| `limit` | batasi jumlah hasil, mis. `5` |

**Response** — array of object
```json
[
  {
    "id": "a1b2c3...",
    "judul": "Musyawarah Desa Bahas Rencana Pembangunan Jalan",
    "slug": "musdes-pembangunan-jalan-dusun-krajan",
    "ringkasan": "...",
    "isi": "...",
    "gambarUrl": "https://drive.google.com/uc?export=view&id=...",
    "tanggal": "2026-06-12",
    "penulis": "Admin Desa",
    "kategori": "Pembangunan"
  }
]
```

### `getBeritaById`
```
GET {WEB_APP_URL}?action=getBeritaById&id=a1b2c3...
```
Response: 1 object berita, atau `null` jika tidak ditemukan.

### `getBeritaBySlug`
Dipakai halaman detail berita (`/berita/[slug]`).
```
GET {WEB_APP_URL}?action=getBeritaBySlug&slug=musdes-pembangunan-jalan-dusun-krajan
```
Response: 1 object berita, atau `null`.

### `getPotensi`
```
GET {WEB_APP_URL}?action=getPotensi
GET {WEB_APP_URL}?action=getPotensi&kategori=UMKM
```
| Query param | Keterangan |
|---|---|
| `kategori` | `UMKM \| Wisata \| Produk Unggulan` |

Response: array object sesuai skema tab `Potensi`.

### `getPotensiById`
```
GET {WEB_APP_URL}?action=getPotensiById&id=...
```

### `getGaleri`
```
GET {WEB_APP_URL}?action=getGaleri
GET {WEB_APP_URL}?action=getGaleri&tipe=foto
```
Response: array object sesuai skema tab `Galeri`.

### `getGaleriById`
```
GET {WEB_APP_URL}?action=getGaleriById&id=...
```

### `getStruktur`
Otomatis terurut berdasarkan kolom `urutan` (ascending).
```
GET {WEB_APP_URL}?action=getStruktur
```
Response: array object sesuai skema tab `StrukturOrganisasi`.

### `getStrukturById`
```
GET {WEB_APP_URL}?action=getStrukturById&id=...
```

---

## 2. Autentikasi (POST)

### `login`
```
POST {WEB_APP_URL}
Body: { "action": "login", "username": "admin_kkn", "password": "..." }
```

**Response sukses**
```json
{ "token": "9f8c...-uuid", "nama": "Admin Sementara KKN", "role": "superadmin" }
```

**Response gagal** (username salah / password salah / akun nonaktif — pesan selalu sama, tidak membocorkan mana yang salah)
```json
{ "error": "Username atau password salah" }
```

Simpan `token` di FE (cookie atau `localStorage`, lihat trade-off di
`SKILL.md §7.4`), lalu sertakan sebagai `sessionToken` di setiap request
tulis berikutnya.

### `logout`
```
POST {WEB_APP_URL}
Body: { "action": "logout", "sessionToken": "9f8c...-uuid" }
```
**Response**
```json
{ "success": true }
```
Hapus juga token dari penyimpanan FE setelah ini.

---

## 3. CRUD Admin (POST, wajib `sessionToken`)

Pola body umum:
```json
{
  "action": "createBerita",
  "sessionToken": "9f8c...-uuid",
  "data": { ... }
}
```

Kalau `sessionToken` invalid/expired, semua endpoint di bawah balas:
```json
{ "error": "Sesi tidak valid, silakan login ulang" }
```
→ FE harus redirect ke halaman login saat menerima response ini.

### Berita
| Action | Body `data` | Keterangan |
|---|---|---|
| `createBerita` | semua kolom Berita kecuali `id` | `id` auto-generate (UUID) |
| `updateBerita` | wajib ada `id`, kolom lain opsional (yang tidak dikirim tidak berubah) | |
| `deleteBerita` | `{ "id": "..." }` | |

Contoh create:
```json
{
  "action": "createBerita",
  "sessionToken": "...",
  "data": {
    "judul": "Kerja Bakti Dusun Krajan",
    "slug": "kerja-bakti-dusun-krajan",
    "ringkasan": "...",
    "isi": "...",
    "gambarUrl": "https://drive.google.com/uc?export=view&id=...",
    "tanggal": "2026-07-20",
    "penulis": "Admin Desa",
    "kategori": "Kegiatan"
  }
}
```
Response:
```json
{ "success": true, "id": "generated-uuid" }
``` 

### Potensi
| Action | Keterangan |
|---|---|
| `createPotensi` | data sesuai skema tab `Potensi` |
| `updatePotensi` | wajib `id` |
| `deletePotensi` | `{ "id": "..." }` |

### Galeri
| Action | Keterangan |
|---|---|
| `createGaleri` | data sesuai skema tab `Galeri` |
| `updateGaleri` | wajib `id` |
| `deleteGaleri` | `{ "id": "..." }` |

### Struktur Organisasi
| Action | Keterangan |
|---|---|
| `createStruktur` | data sesuai skema tab `StrukturOrganisasi` |
| `updateStruktur` | wajib `id` |
| `deleteStruktur` | `{ "id": "..." }` |

### Profil & Statistik (single-row, hanya update)
```json
{
  "action": "updateProfil",
  "sessionToken": "...",
  "data": { "id": "main", "namaDesa": "Desa Sumbermulyo", "luasWilayah": 5.1 }
}
```
```json
{
  "action": "updateStatistik",
  "sessionToken": "...",
  "data": { "id": "main", "jumlahPenduduk": 4300 }
}
```
Tidak ada `createProfil`/`deleteProfil` — baris `id: "main"` dibuat sekali
lewat seed data.

### Users (khusus role `superadmin`)
Selain butuh `sessionToken` valid, role sesi harus `superadmin`, kalau tidak:
```json
{ "error": "Hanya superadmin yang boleh mengelola akun pengguna" }
```

| Action | Body `data` | Keterangan |
|---|---|---|
| `createUsers` | `{ "username", "password", "nama", "role" }` | password di-hash otomatis di server, `role` default `"admin"` jika tidak diisi/tidak valid |
| `updateUsers` | wajib `id`, field lain opsional (`nama`, `role`, `aktif`) | **jangan** kirim `password`/`passwordHash` mentah di sini — endpoint ini tidak melakukan re-hash, hanya update field biasa |
| `deleteUsers` | `{ "id": "..." }` | |

Contoh create user baru:
```json
{
  "action": "createUsers",
  "sessionToken": "...",
  "data": {
    "username": "sekdes_baru",
    "password": "PasswordAman123!",
    "nama": "Sekretaris Desa",
    "role": "admin"
  }
}
```
Response:
```json
{ "success": true, "id": "generated-uuid" }
```
Error jika username sudah dipakai:
```json
{ "error": "Username sudah digunakan" }
```

---

## 4. Upload Gambar (POST, wajib `sessionToken`)

### `uploadGambar`
```json
{
  "action": "uploadGambar",
  "sessionToken": "...",
  "data": {
    "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "fileName": "kegiatan-gotong-royong.jpg",
    "mimeType": "image/jpeg",
    "folder": "GALERI"
  }
}
```

| Field `data` | Wajib? | Keterangan |
|---|---|---|
| `base64` | ya | boleh dengan atau tanpa prefix `data:image/...;base64,` |
| `fileName` | tidak | default `upload-<timestamp>` |
| `mimeType` | tidak | default `image/jpeg`, diabaikan jika `base64` sudah punya prefix data URL |
| `folder` | tidak | salah satu: `BERITA`, `POTENSI`, `GALERI`, `STRUKTUR`, `PROFIL` — default `GALERI` |

**Response sukses**
```json
{
  "success": true,
  "url": "https://drive.google.com/uc?export=view&id=1AbCdEfGhIj",
  "fileId": "1AbCdEfGhIj"
}
```
→ isi `url` ini ke field `gambarUrl`/`fotoUrl`/`logoUrl`/`heroImageUrl`
sesuai fitur, lalu kirim lewat `createX`/`updateX` seperti biasa.

**Response gagal**
```json
{ "error": "Ukuran gambar melebihi batas 5MB" }
```
atau
```json
{ "error": "Gagal upload gambar: <pesan error asli>" }
```

Batas ukuran diatur di `Config.gs` → `MAX_UPLOAD_SIZE_MB` (default 5MB).

---

## 5. Ringkasan semua action

| Action | Method | Login? | Role |
|---|---|---|---|
| `getProfil` | GET | tidak | - |
| `getStatistik` | GET | tidak | - |
| `getBerita` / `getBeritaById` / `getBeritaBySlug` | GET | tidak | - |
| `getPotensi` / `getPotensiById` | GET | tidak | - |
| `getGaleri` / `getGaleriById` | GET | tidak | - |
| `getStruktur` / `getStrukturById` | GET | tidak | - |
| `login` | POST | tidak | - |
| `logout` | POST | tidak (kirim token yang mau dihapus) | - |
| `createBerita` / `updateBerita` / `deleteBerita` | POST | ya | admin/superadmin |
| `createPotensi` / `updatePotensi` / `deletePotensi` | POST | ya | admin/superadmin |
| `createGaleri` / `updateGaleri` / `deleteGaleri` | POST | ya | admin/superadmin |
| `createStruktur` / `updateStruktur` / `deleteStruktur` | POST | ya | admin/superadmin |
| `updateProfil` | POST | ya | admin/superadmin |
| `updateStatistik` | POST | ya | admin/superadmin |
| `createUsers` / `updateUsers` / `deleteUsers` | POST | ya | **superadmin saja** |
| `uploadGambar` | POST | ya | admin/superadmin |

---

## 6. Contoh alur lengkap dari FE (pseudo-code)

```javascript
const WEB_APP_URL = 'https://script.google.com/macros/s/XXXX/exec';

// 1. Login
const loginRes = await fetch(WEB_APP_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify({ action: 'login', username, password }),
}).then(r => r.json());

if (loginRes.error) { /* tampilkan error, stop */ }
const sessionToken = loginRes.token;

// 2. Upload gambar dulu (misal untuk berita baru)
const uploadRes = await fetch(WEB_APP_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify({
    action: 'uploadGambar',
    sessionToken,
    data: { base64: fileBase64, fileName: 'foto.jpg', folder: 'BERITA' },
  }),
}).then(r => r.json());

// 3. Buat berita pakai URL gambar dari langkah 2
const createRes = await fetch(WEB_APP_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify({
    action: 'createBerita',
    sessionToken,
    data: {
      judul: 'Judul Berita',
      slug: 'judul-berita',
      ringkasan: '...',
      isi: '...',
      gambarUrl: uploadRes.url,
      tanggal: '2026-07-21',
      penulis: 'Admin Desa',
      kategori: 'Kegiatan',
    },
  }),
}).then(r => r.json());

// 4. Tampilkan data publik (tanpa login)
const daftarBerita = await fetch(`${WEB_APP_URL}?action=getBerita&sortBy=tanggal`)
  .then(r => r.json());
```

---

## 7. Troubleshooting singkat

| Gejala | Kemungkinan penyebab |
|---|---|
| Response berupa HTML, bukan JSON | Belum redeploy versi baru setelah edit `.gs` |
| `action tidak dikenal: undefined` | `action` tidak terkirim di body/query, cek penulisan key |
| `Sesi tidak valid, silakan login ulang` padahal baru login | `sessionToken` tidak ikut terkirim, atau typo nama field |
| `Tab "X" tidak ditemukan...` | Nama tab Sheets tidak sama persis dengan `Config.gs` |
| CORS error di console browser | Jangan pakai header `Content-Type: application/json`, gunakan `text/plain` seperti contoh di atas |

Lihat juga `docs/skema-sheets.md` untuk detail kolom tiap tab, dan `SETUP.md`
di folder `backend-apps-script/` untuk panduan deploy dari nol.