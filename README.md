# Website Karang Taruna RT 02

Website Karang Taruna tingkat RT dengan **React (Vite) + Tailwind CSS** di frontend dan **Node.js + Express** di backend.

## Struktur Project

```
karang-taruna/
├── backend/     # API Express
│   ├── server.js
│   └── src/
│       ├── app.js              # Setup Express, CORS, routing
│       ├── db.js               # Koneksi Turso (libSQL) + skema + seeding
│       ├── routes/             # Endpoint API
│       └── data/seed.js        # Data awal untuk seeding database
└── frontend/    # React + Vite + Tailwind
    └── src/
        ├── components/         # Navbar, Footer
        ├── pages/              # Beranda, Profil, Berita, Agenda, Galeri, Kontak
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
| GET    | `/api/kegiatan`  | Daftar kegiatan           |
| GET    | `/api/anggota`   | Daftar anggota            |
| POST   | `/api/anggota`   | Pendaftaran anggota baru  |
| GET    | `/api/galeri`    | Daftar foto galeri        |
| GET    | `/api/stats`     | Statistik jumlah data     |
| POST   | `/api/kontak`    | Simpan pesan form kontak  |
| POST   | `/api/auth/login`| Login admin (TODO)        |

## Fitur Frontend

- Beranda (hero, statistik, berita terbaru, agenda terdekat)
- Detail berita (`/berita/:id`) & pencarian berita
- Agenda kegiatan & galeri foto dengan lightbox
- Struktur organisasi (bagan) & profil organisasi
- Form pendaftaran anggota online (`/daftar`)
- Halaman kontak & tombol WhatsApp mengambang
- Dark mode (mengikuti preferensi sistem) & skeleton loader
- Halaman 404

## Langkah Berikutnya

- [x] Ganti data contoh (`seed.js`) dengan database — memakai Turso (libSQL)
- [x] Form kontak tersambung ke backend (POST `/api/kontak`)
- [ ] Implementasi login admin (JWT + bcrypt) & panel admin untuk kelola konten
- [ ] Upload foto galeri (mis. Multer / Cloudinary)
- [ ] Deploy: frontend ke Vercel/Netlify, backend ke VPS/Railway/Render

## Keamanan

Yang sudah diterapkan di backend:

- **Helmet** — security headers (X-Content-Type-Options, dll).
- **CORS dibatasi** — hanya origin di `CORS_ORIGIN` yang diizinkan (default `http://localhost:5173`).
- **Rate limiting** — seluruh `/api` dibatasi 300 request/15 menit, dan form publik
  (pendaftaran & kontak) dibatasi 10 pengiriman/15 menit per IP.
- **Validasi input** — memakai `express-validator` (panjang maksimal, format email, tipe data).
- **Query parameterized** — aman dari SQL injection.
- **Error handler** — tidak membocorkan stack trace.
- **X-Powered-By dimatikan** — versi Express tidak terekspos.

> **Produksi (di belakang reverse proxy):** set `TRUST_PROXY=1` di `.env`
> agar rate limiter membaca IP asli pengguna, bukan IP proxy.

## Catatan Keamanan

Hasil `npm audit` di backend menunjukkan 3 kerentanan **hanya pada dependency
development** (nodemon → chokidar → braces). Dependency production (express, cors,
dotenv) bersih (0 kerentanan). Jangan jalankan `npm audit fix --force` karena akan
menurunkan nodemon ke versi lama.
