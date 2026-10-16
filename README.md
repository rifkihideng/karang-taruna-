<div align="center">

<img src="frontend/public/logo-karang-taruna.jpeg" alt="Logo Karang Taruna RT 02" width="120" />

# 🌐 Website Karang Taruna RT 02

Website resmi **Karang Taruna RT 02 / RW 012** — platform informasi, agenda kegiatan, galeri, dan pendaftaran anggota untuk para pemuda-pemudi.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)
![Turso](https://img.shields.io/badge/Turso-libSQL-4FF8D2?style=flat-square&logo=turso&logoColor=black)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## 📚 Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Struktur Proyek](#struktur-proyek)
- [Menjalankan Secara Lokal](#menjalankan-secara-lokal)
- [Endpoint API](#endpoint-api)
- [Autentikasi Admin](#autentikasi-admin)
- [Deploy ke Vercel](#deploy-ke-vercel)
- [Keamanan](#keamanan)
- [Rotasi Rahasia Produksi](#rotasi-rahasia-produksi)
- [Roadmap](#roadmap)
- [Catatan](#catatan)

---

## ✨ Fitur

| Fitur | Keterangan |
| --- | --- |
| 🏠 Beranda | Hero, statistik dinamis, dan berita terbaru |
| 🏛️ Profil & Struktur | Visi-misi, logo, dan bagan organisasi |
| 📅 Agenda | Daftar kegiatan dari database |
| 🖼️ Galeri | Galeri foto dengan lightbox |
| 📝 Pendaftaran Anggota | Form pendaftaran → diarahkan ke grup WhatsApp |
| ❓ FAQ | Pertanyaan yang sering diajukan |
| 🌙 Mode Gelap | Toggle tema yang tersimpan di `localStorage` |
| ✨ Animasi | Scroll reveal, loading screen, dan skeleton loader |
| 🔒 Keamanan | Obfuscation kode + proteksi API |

## 🧱 Teknologi

| Lapisan | Teknologi |
| --- | --- |
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router 7 |
| Animasi & Grafik | Framer Motion, GSAP, Recharts, Lucide |
| Backend | Node.js, Express 4 |
| Database | Turso (libSQL), SQLite lokal untuk development |
| Penyimpanan File | Vercel Blob (produksi), folder `uploads/` (development) |
| Autentikasi | JWT + bcrypt |
| Deployment | Vercel (monorepo dua service) |

## 📁 Struktur Proyek

```text
karang-taruna/
├── backend/
│   ├── server.js              # Entrypoint server lokal
│   ├── scripts/
│   │   └── obfuscate.mjs      # Bundle + obfuscation backend
│   ├── dist/
│   │   └── vercel.js          # Bundle ter-obfuscation (entrypoint Vercel)
│   ├── data/
│   │   └── karang-taruna.db   # SQLite lokal (development)
│   └── src/
│       ├── app.js             # Setup Express, CORS, routing, error handler
│       ├── db.js              # Koneksi Turso (libSQL) + skema + seeding
│       ├── vercel.js          # Entrypoint serverless Vercel
│       ├── middleware/        # Rate limiter & autentikasi admin
│       ├── utils/             # Helper pagination
│       ├── routes/            # Endpoint API
│       └── data/seed.js       # Data awal untuk seeding database
└── frontend/
    ├── index.html
    ├── vite.config.js         # Konfigurasi Vite + plugin obfuscation
    └── src/
        ├── components/        # Navbar, Footer, LoadingScreen, Reveal, dll.
        ├── pages/             # Beranda, Profil, Struktur, Agenda, Galeri, dll.
        ├── hooks/useFetch.js  # Hook pengambilan data dari API
        └── lib/               # Helper API & format tanggal
```

## 🚀 Menjalankan Secara Lokal

### Prasyarat

- **Node.js 20+** dan **npm**
- (Opsional) Akun [Turso](https://turso.tech) untuk database remote

### 1. Backend (port 5000)

```bash
cd backend
npm install
npm run dev     # atau: npm start
```

Database memakai **Turso (libSQL)**. Buat file `.env` di dalam `backend/` lalu isi:

```env
TURSO_DATABASE_URL=libsql://<nama-db>-<organisasi>.turso.io
TURSO_AUTH_TOKEN=<token dari dashboard Turso>
```

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `TURSO_DATABASE_URL` | Tidak | URL database Turso, format `libsql://...` |
| `TURSO_AUTH_TOKEN` | Tidak | Token autentikasi Turso |

> 💡 Jika kedua variabel `TURSO_*` dikosongkan, server otomatis memakai SQLite lokal di `backend/data/karang-taruna.db` — cocok untuk development.

### 2. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Buka http://localhost:5173. Permintaan `/api/*` otomatis diteruskan (proxy) ke backend di `http://localhost:5000`.

## 🔌 Endpoint API

### Endpoint Publik

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| GET | `/api/health` | Cek status server |
| GET | `/api/berita` | Daftar berita |
| GET | `/api/berita/:id` | Detail berita |
| GET | `/api/kegiatan` | Daftar kegiatan |
| GET | `/api/kegiatan/:id` | Detail kegiatan |
| GET | `/api/anggota` | Daftar anggota (nama, jabatan, angkatan) |
| GET | `/api/anggota/:id` | Detail anggota |
| POST | `/api/anggota` | Pendaftaran anggota baru |
| GET | `/api/galeri` | Daftar foto galeri |
| GET | `/api/stats` | Statistik jumlah data |
| POST | `/api/kontak` | Simpan pesan form kontak |
| POST | `/api/auth/login` | Login admin (JWT + bcrypt) |

### Endpoint Admin 🔒

Endpoint berikut memerlukan header `Authorization: Bearer <token>` dari login admin.

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| POST | `/api/berita` | Tambah berita (multipart: unggah file `gambar`) |
| PUT | `/api/berita/:id` | Perbarui berita |
| DELETE | `/api/berita/:id` | Hapus berita |
| POST | `/api/kegiatan` | Tambah kegiatan |
| PUT | `/api/kegiatan/:id` | Perbarui kegiatan |
| DELETE | `/api/kegiatan/:id` | Hapus kegiatan |
| DELETE | `/api/anggota/:id` | Hapus anggota (soft delete) |
| POST | `/api/anggota/:id/restore` | Pulihkan anggota terhapus |
| DELETE | `/api/anggota/:id/permanent` | Hapus anggota permanen |
| GET | `/api/anggota/admin/pendaftar` | Daftar pendaftar baru |
| GET | `/api/anggota/admin/rekap` | Rekap data anggota |
| GET | `/api/anggota/admin/statistik` | Statistik anggota |
| GET | `/api/anggota/admin/terhapus` | Daftar anggota terhapus |
| GET | `/api/kontak` | Daftar pesan kontak |
| DELETE | `/api/kontak/:id` | Hapus pesan kontak |

> 📄 Endpoint list (`/api/berita`, `/api/kegiatan`, `/api/anggota`, `/api/galeri`) mendukung pagination via query `?limit=` dan `?offset=` (maksimal 200 per halaman).

## 👤 Autentikasi Admin

Saat pertama kali dijalankan, backend membuat tabel `admin_users` dan men-seed satu akun admin (`username: admin`). Pengaturan terkait:

| Variabel | Default | Keterangan |
| --- | --- | --- |
| `ADMIN_PASSWORD` | — | Password awal admin, hanya dipakai saat seed |
| `ADMIN_SALT_ROUNDS` | `10` | Jumlah putaran salt bcrypt |
| `ADMIN_PEPPER` | — | Pepper opsional yang ditambahkan ke password sebelum hashing |

> 🔎 Jika `ADMIN_PASSWORD` tidak di-set, backend membuat password acak sekali pakai dan menampilkannya di log. Password selalu disimpan sebagai hash bcrypt di database, bukan plaintext.

Untuk mengubah password di development: ubah `ADMIN_PASSWORD`, lalu kosongkan tabel `admin_users` (atau hapus file DB lokal) dan restart server agar seed dijalankan ulang.

> ⚠️ Untuk produksi: sediakan mekanisme reset password yang aman, gunakan HTTPS, simpan hanya hash bcrypt, dan jangan pernah menyimpan password plaintext di repository atau log.

### Agenda & Pendaftar

- Halaman `/admin` menyediakan CRUD agenda. Penambahan, perubahan, dan penghapusan agenda serta endpoint pendaftar baru memerlukan token admin dari `/api/auth/login`.
- Data pendaftar baru tersedia melalui `GET /api/anggota/admin/pendaftar`. Endpoint publik anggota hanya mengembalikan nama, jabatan, dan angkatan — bukan alamat atau kontak.

## ☁️ Deploy ke Vercel

Frontend dan backend di-deploy dalam **satu project Vercel** melalui dua service yang diatur di `vercel.json`:

| Service | Root | Keterangan |
| --- | --- | --- |
| `web` | `frontend` | Frontend Vite (framework auto-detected) |
| `api` | `backend` | Backend Express, entrypoint `dist/vercel.js` |

Saat deploy, service `api` menjalankan `npm run build:obfuscate` untuk membundle + meng-obfuscate backend, sedangkan service `web` menjalankan `vite build` yang otomatis meng-obfuscate bundle frontend melalui plugin di `vite.config.js`.

### Langkah Deploy

1. Push repository ke GitHub.
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → import repository.
3. Vercel otomatis membaca `vercel.json` dan membangun kedua service.
4. Isi **Environment Variables**:

| Variabel | Keterangan |
| --- | --- |
| `TURSO_DATABASE_URL` | URL database Turso |
| `TURSO_AUTH_TOKEN` | Token autentikasi Turso |
| `JWT_SECRET` | Kunci untuk menandatangani token admin |
| `ADMIN_PASSWORD` | Password admin awal (dipakai saat seed) |
| `ADMIN_PEPPER` | Pepper opsional untuk hash password |
| `CORS_ORIGIN` | URL frontend produksi, mis. `https://nama-project.vercel.app` |
| `BLOB_READ_WRITE_TOKEN` | Token dari **Storage → Blob** di dashboard Vercel |
| `TRUST_PROXY` | Set ke `1` |

5. Deploy.

> 📌 **Catatan:** SQLite lokal tidak dipakai di Vercel (filesystem read-only) — backend otomatis memakai Turso. Gambar berita yang masih memakai path `/uploads/...` dari development perlu diunggah ulang lewat panel admin setelah deploy (gambar baru otomatis masuk Vercel Blob).

## 🔐 Keamanan

Proteksi yang sudah diterapkan di backend:

| Proteksi | Keterangan |
| --- | --- |
| 🛡️ Helmet | Security headers (`X-Content-Type-Options`, dll.) |
| 🌐 CORS dibatasi | Hanya origin di `CORS_ORIGIN` yang diizinkan |
| ⏱️ Rate limiting | Seluruh `/api`: 300 request/15 menit; form publik: 10 pengiriman/15 menit per IP |
| ✅ Validasi input | `express-validator` (panjang maksimal, format email, tipe data) |
| 🗄️ Query parameterized | Aman dari SQL injection |
| 🚨 Error handler | Respons tanpa detail; stack trace hanya di development |
| 🙈 `X-Powered-By` dimatikan | Versi Express tidak terekspos |

### 🔏 Obfuscation Kode

Kode yang dikirim atau di-deploy disamarkan agar sulit dibaca dan digunakan ulang:

- **Frontend** — plugin obfuscation di [frontend/vite.config.js](frontend/vite.config.js) meng-obfuscate setiap chunk JS saat `npm run build` (menggunakan [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator)).
- **Backend** — `npm run build:obfuscate` di [backend](backend) membundle seluruh kode backend menjadi satu file ESM dengan `esbuild`, lalu meng-obfuscate-nya ke [backend/dist/vercel.js](backend/dist/vercel.js). File inilah yang dipakai Vercel sebagai entrypoint API.

> ⚠️ **Penting:** obfuscation **bukan enkripsi**. Kode frontend yang dikirim ke browser pada dasarnya tetap publik dan masih bisa dianalisis oleh orang yang berusaha. Obfuscation hanya mempersulit pembacaan, bukan mengamankan data. Rahasia (JWT secret, token Turso, dan sebagainya) harus tetap hanya ada di environment variable server — jangan pernah dimasukkan ke kode frontend.

> 🔧 Untuk mengubah opsi obfuscation, edit `obfuscationOptions` di [frontend/vite.config.js](frontend/vite.config.js) atau [backend/scripts/obfuscate.mjs](backend/scripts/obfuscate.mjs).

## 🔑 Rotasi Rahasia Produksi

> 🚨 Wajib dilakukan jika rahasia production pernah tersimpan di mesin development.

Jika `.env` lokal pernah berisi rahasia yang **sama** dengan production (JWT secret, password admin, token Turso), file itu menjadi kunci penuh ke production. Lakukan rotasi berikut agar nilai lama tidak berlaku lagi:

1. **`JWT_SECRET`** — generate nilai acak baru, set di dashboard Vercel (Project → Settings → Environment Variables → Production). Ini langsung membatalkan semua token admin lama.
2. **`ADMIN_PASSWORD` & `ADMIN_PEPPER`** — generate nilai acak baru dan set di Vercel. Karena hash lama tetap tersimpan di `admin_users`, hapus dulu baris admin lalu redeploy agar seed membuat hash baru:

   ```sql
   -- via Turso CLI (turso db shell ...) atau Turso Dashboard
   DELETE FROM admin_users WHERE username = 'admin';
   ```

   Setelah redeploy, `seedIfEmpty()` akan membuat ulang akun admin dengan password + pepper yang baru.
3. **`TURSO_AUTH_TOKEN`** — di dashboard Turso, regenerate token database dan perbarui nilainya di Vercel. Token lama otomatis tidak berlaku.
4. **`.env` lokal** — pastikan memakai nilai **berbeda** dan biarkan `TURSO_*` kosong agar development memakai SQLite lokal, bukan database production.

> ⚠️ Mengubah nilai environment saja **tidak** mengubah hash admin yang tersimpan; hash baru hanya dibuat saat tabel `admin_users` kosong (seed).

## 🗺️ Roadmap

- [x] Data contoh (`seed.js`) memakai database Turso (libSQL)
- [x] Form kontak tersambung ke backend (POST `/api/kontak`)
- [x] Login admin (JWT + bcrypt) & panel admin untuk kelola konten
- [x] Siap deploy ke Vercel (frontend + backend dalam satu project)
- [x] Obfuscation kode frontend & backend
- [ ] Upload foto galeri (mis. Multer / Cloudinary)

## 📝 Catatan

Hasil `npm audit --omit=dev` di backend menunjukkan **0 kerentanan** pada dependency production. Kerentanan yang muncul hanya ada di dependency development (nodemon → chokidar → braces), jadi jangan jalankan `npm audit fix --force` karena akan menurunkan nodemon ke versi lama.

---

<div align="center">

Dibuat dengan ❤️ oleh **Karang Taruna RT 02 / RW 012**

</div>