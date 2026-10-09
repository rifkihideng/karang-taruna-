# Website Karang Taruna RT 02

Website Karang Taruna tingkat RT dengan **React (Vite) + Tailwind CSS** di frontend dan **Node.js + Express** di backend.

## Struktur Project

```
karang-taruna/
├── backend/     # API Express
│   ├── server.js
│   └── src/
│       ├── app.js              # Setup Express, CORS, routing
│       ├── routes/             # Endpoint API
│       └── data/seed.js        # Data contoh (akan diganti database)
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

- [ ] Ganti data contoh (`seed.js`) dengan database MySQL/PostgreSQL (mis. Prisma)
- [ ] Implementasi login admin (JWT + bcrypt) & panel admin untuk kelola konten
- [ ] Upload foto galeri (mis. Multer / Cloudinary)
- [ ] Form kontak tersambung ke backend
- [ ] Deploy: frontend ke Vercel/Netlify, backend ke VPS/Railway/Render

## Catatan Keamanan

Hasil `npm audit` di backend menunjukkan 3 kerentanan **hanya pada dependency
development** (nodemon → chokidar → braces). Dependency production (express, cors,
dotenv) bersih (0 kerentanan). Jangan jalankan `npm audit fix --force` karena akan
menurunkan nodemon ke versi lama.
