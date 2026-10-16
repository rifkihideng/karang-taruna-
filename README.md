# Website Karang Taruna RT 02

Website Karang Taruna tingkat RT dengan **React (Vite) + Tailwind CSS** di frontend dan **Node.js + Express** di backend.

## Struktur Project

```
karang-taruna/
├── backend/     # API Express
│   ├── server.js
│   └── src/
│       ├── app.js              # Setup Express, CORS, routing, error handler
│       ├── db.js               # Koneksi Turso (libSQL) + skema + seeding
│       ├── middleware/         # Rate limiter
│       ├── utils/              # Helper pagination
│       ├── routes/             # Endpoint API
│       └── data/seed.js        # Data awal untuk seeding database
└── frontend/    # React + Vite + Tailwind
    └── src/
        ├── components/         # Navbar, Footer, LoadingScreen, Reveal, Skeleton, CountUp
        ├── pages/              # Beranda, Profil, Struktur, Agenda, Galeri, Daftar, Faq
        ├── hooks/useFetch.js   # Hook ambil data dari API
        └── lib/                # Helper API & format tanggal
```

## Cara Menjalankan

### 1. Backend (port 5000)

```bash
cd backend
npm install
npm run dev   # atau: npm start
```

Database memakai **Turso (libSQL)**. Untuk koneksi ke database Turso, buat file
`.env` (contoh ada di `.env.example`) lalu isi:

```
TURSO_DATABASE_URL=libsql://<nama-db>-<organisasi>.turso.io
TURSO_AUTH_TOKEN=<token dari dashboard Turso>
```

Jika keduanya dikosongkan, server otomatis memakai database SQLite lokal di
`backend/data/karang-taruna.db` (cocok untuk development).

### 2. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Buka http://localhost:5173. Permintaan `/api/*` dari frontend otomatis
diteruskan (proxy) ke backend di `http://localhost:5000`.

## Endpoint API

| Method | Path             | Keterangan                |
| ------ | ---------------- | ------------------------- |
| GET    | `/api/health`    | Cek status server         |
| GET    | `/api/berita`    | Daftar berita             |
| GET    | `/api/berita/:id`| Detail berita             |
| POST   | `/api/berita`    | Tambah berita (admin, multipart: unggah file `gambar`) |
| GET    | `/api/kegiatan`  | Daftar kegiatan           |
| GET    | `/api/anggota`   | Daftar anggota            |
| POST   | `/api/anggota`   | Pendaftaran anggota baru  |
| GET    | `/api/galeri`    | Daftar foto galeri        |
| GET    | `/api/stats`     | Statistik jumlah data     |
| POST   | `/api/kontak`    | Simpan pesan form kontak  |
| POST   | `/api/auth/login`| Login admin (TODO)        |

Endpoint list (`/api/berita`, `/api/kegiatan`, `/api/anggota`, `/api/galeri`)
mendukung pagination via query `?limit=` dan `?offset=` (maks. 200 per halaman).

## Fitur Frontend

- Beranda (hero, statistik dinamis, berita terbaru)
- Profil organisasi (visi & misi + logo) & struktur organisasi (bagan)
- Agenda kegiatan dari database (`/agenda`)
- Galeri foto dengan lightbox (`/galeri`)
- Form pendaftaran anggota (`/daftar`) → setelah daftar diarahkan ke grup WhatsApp
- Halaman FAQ (`/faq`) berisi pertanyaan yang sering diajukan
- Loading screen (logo + motto) saat aplikasi pertama dimuat
- Animasi scroll reveal (fade-in) di seluruh halaman
- Dark mode (toggle + tersimpan di localStorage) & skeleton loader
- Halaman 404

## Langkah Berikutnya

- [x] Ganti data contoh (`seed.js`) dengan database — memakai Turso (libSQL)
- [x] Form kontak tersambung ke backend (POST `/api/kontak`)
- [x] Implementasi login admin (JWT + bcrypt) & panel admin untuk kelola konten (basic development flow)
- [ ] Upload foto galeri (mis. Multer / Cloudinary)
- [x] Siap deploy ke Vercel (frontend + backend dalam satu project)

## Deploy ke Vercel

Frontend dan backend di-deploy dalam **satu project Vercel**:

- `vercel.json` di root mengatur dua service: `web` (frontend Vite) dan `api`
  (backend Express, entrypoint `backend/dist/vercel.js`). Saat deploy, service
  `api` menjalankan `npm run build:obfuscate` untuk membundle + meng-obfuscate
  backend; service `web` menjalankan `vite build` yang otomatis meng-obfuscate
  bundle frontend melalui plugin di `vite.config.js`.
- `package.json` di root berisi dependency backend agar bisa di-bundle oleh Vercel.
- Upload gambar berita memakai **Vercel Blob** di produksi, dan folder lokal
  `backend/uploads/` di development.

**Langkah:**

1. Push repo ke GitHub.
2. Di [vercel.com](https://vercel.com) → **Add New Project** → import repo.
3. Vercel akan otomatis membaca `vercel.json` (framework: Other).
4. Isi **Environment Variables**:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `JWT_SECRET`
   - `ADMIN_PASSWORD`
   - `ADMIN_PEPPER` (opsional)
   - `CORS_ORIGIN` = URL Vercel kamu (mis. `https://nama-project.vercel.app`)
   - `BLOB_READ_WRITE_TOKEN` = token dari **Storage → Blob** di dashboard Vercel
   - `TRUST_PROXY` = `1`
5. Deploy.

**Catatan:** database SQLite lokal tidak dipakai di Vercel (filesystem read-only);
backend akan memakai Turso. Foto berita yang sudah terlanjur memakai path
`/uploads/...` dari development perlu di-upload ulang lewat panel admin setelah
deploy (gambar baru otomatis masuk Vercel Blob).

## Admin (development)

Backend sekarang menambahkan tabel `admin_users` dan menyertakan satu akun admin saat pertama kali dijalankan (seed). Pengaturan terkait:

- ADMIN_PASSWORD (tidak ada default) — password awal (digunakan hanya saat seed). Jika tidak di-set, backend membuat password acak sekali pakai dan menampilkannya di log.
- ADMIN_SALT_ROUNDS (default `10`) — salt rounds untuk bcrypt.
- ADMIN_PEPPER (opsional) — nilai 'pepper' yang akan ditambahkan ke password sebelum hashing; simpan hanya di environment.

Setelah seed, password disimpan sebagai hash bcrypt di database lokal (`backend/data/karang-taruna.db`). Untuk mengubah password di development, ubah `ADMIN_PASSWORD` lalu hapus/mengosongkan tabel `admin_users` atau hapus file DB lokal lalu restart server agar seed dijalankan ulang.

Untuk produksi: buat mekanisme reset password yang aman, gunakan HTTPS, simpan hanya hash (bcrypt) dan jangan menyimpan password plaintext di repository atau logs.

### Agenda dan pendaftar

Halaman `/admin` menyediakan CRUD agenda. Penambahan, perubahan, dan penghapusan agenda serta endpoint daftar pendaftar baru wajib memakai token admin dari `/api/auth/login`.
Data pendaftar baru tersedia melalui `GET /api/anggota/admin/pendaftar`; endpoint publik anggota hanya mengembalikan nama, jabatan, dan angkatan, bukan alamat atau kontak.
## Keamanan

Yang sudah diterapkan di backend:

- **Helmet** — security headers (X-Content-Type-Options, dll).
- **CORS dibatasi** — hanya origin di `CORS_ORIGIN` yang diizinkan (default `http://localhost:5173`).
- **Rate limiting** — seluruh `/api` dibatasi 300 request/15 menit, dan form publik
  (pendaftaran & kontak) dibatasi 10 pengiriman/15 menit per IP.
- **Validasi input** — memakai `express-validator` (panjang maksimal, format email, tipe data).
- **Pagination** — endpoint list mendukung `?limit=` & `?offset=` (maks. 200/halaman).
- **Query parameterized** — aman dari SQL injection.
- **Error handler** — respons tanpa detail; log ringkas, stack trace hanya di development.
- **X-Powered-By dimatikan** — versi Express tidak terekspos.

### Obfuscation kode

Kode yang dikirim/di-deploy disamarkan agar sulit dibaca/digunakan ulang:

- **Frontend** — plugin obfuscation di [frontend/vite.config.js](frontend/vite.config.js)
  meng-obfuscate setiap chunk JS saat `npm run build` (pakai
  [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator)).
- **Backend** — `npm run build:obfuscate` di [backend](backend) membundle seluruh
  kode backend menjadi satu file ESM dengan `esbuild`, lalu meng-obfuscate-nya ke
  [backend/dist/vercel.js](backend/dist/vercel.js). File inilah yang dipakai
  Vercel sebagai entrypoint API (lihat `vercel.json`).

> **Penting:** obfuscation **bukan enkripsi**. Kode frontend yang dikirim ke
> browser pada dasarnya tetap publik dan masih bisa dianalisis/di-deobfuscate
> oleh orang yang berusaha. Obfuscation hanya mempersulit pembacaan, bukan
> pengaman data. Rahasia (JWT secret, token Turso, dsb.) harus tetap hanya ada
> di environment variable server — jangan pernah dimasukkan ke kode frontend.
> Untuk mengubah opsi obfuscation, edit `obfuscationOptions` di
> [frontend/vite.config.js](frontend/vite.config.js) atau
> [backend/scripts/obfuscate.mjs](backend/scripts/obfuscate.mjs).

> **Produksi (di belakang reverse proxy):** set `TRUST_PROXY=1` di `.env`
> agar rate limiter membaca IP asli pengguna, bukan IP proxy.

## Rotasi Rahasia Production (wajib setelah rahasia terlanjur tersimpan di mesin development)

Jika `.env` lokal pernah berisi rahasia yang **sama** dengan production (JWT secret,
password admin, token Turso), file itu menjadi kunci penuh ke production. Lakukan
rotasi berikut agar nilai yang lama tidak berlaku lagi:

1. **`JWT_SECRET`** — generate nilai acak baru, set di dashboard Vercel
   (Project → Settings → Environment Variables → Production). Ini langsung
   membatalkan semua token admin lama.
2. **`ADMIN_PASSWORD` & `ADMIN_PEPPER`** — generate nilai acak baru dan set di
   Vercel. Karena hash lama tetap tersimpan di `admin_users`, hapus dulu baris
   admin lalu redeploy agar seed membuat hash baru:

   ```sql
   -- via Turso CLI (turso db shell ...) atau Turso Dashboard
   DELETE FROM admin_users WHERE username = 'admin';
   ```

   Setelah redeploy, `seedIfEmpty()` akan membuat ulang akun admin dengan
   password + pepper yang baru.
3. **`TURSO_AUTH_TOKEN`** — di dashboard Turso, regenerate token database dan
   perbarui nilainya di Vercel. Token lama otomatis tidak berlaku.
4. **`.env` lokal** — pastikan memakai nilai **berbeda** dan biarkan `TURSO_*`
   kosong agar development memakai SQLite lokal, bukan database production.

> Mengubah nilai environment saja **tidak** mengubah hash admin yang sudah
> tersimpan; hash baru hanya dibuat saat tabel `admin_users` kosong (seed).

## Catatan Keamanan

Hasil `npm audit --omit=dev` di backend menunjukkan **0 kerentanan** pada dependency
production. Kerentanan yang pernah muncul hanya ada di dependency development
(nodemon → chokidar → braces), jadi jangan jalankan `npm audit fix --force` karena
akan menurunkan nodemon ke versi lama.
