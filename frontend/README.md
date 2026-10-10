# Frontend — Website Karang Taruna RT 02

Frontend website Karang Taruna RT 02, dibangun dengan **React 19 + Vite + Tailwind CSS**.

## Menjalankan

```bash
npm install
npm run dev      # jalankan di http://localhost:5173
npm run build    # build produksi
npm run preview  # preview hasil build
npm run lint     # oxlint
```

Permintaan `/api/*` dari frontend otomatis diteruskan (proxy) ke backend di
`http://localhost:5000` (lihat `vite.config.js`).

## Struktur

- `src/components/` — Navbar, Footer, LoadingScreen, Reveal, Skeleton, CountUp
- `src/pages/` — Beranda, Profil, Struktur, Agenda, Galeri, Daftar, Faq, dll.
- `src/hooks/useFetch.js` — hook untuk mengambil data dari API
- `src/lib/api.js` — helper `fetchData` & `postData`

Lihat [`../README.md`](../README.md) untuk dokumentasi lengkap project.

