import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { formatTanggal } from '../lib/format';
import Skeleton from '../components/Skeleton';

export default function Berita() {
  const { data: berita, loading, error } = useFetch('/berita');

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Berita & Kegiatan</h1>
      <p className="mt-2 text-gray-600 dark:text-slate-400">
        Informasi terbaru seputar kegiatan Karang Taruna RT 02.
      </p>

      {loading ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-8 text-red-500">Gagal memuat berita: {error}</p>
      ) : !berita || berita.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-white p-6 text-gray-500 ring-1 ring-gray-100 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
          Belum ada berita.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {berita.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700"
            >
              {item.gambar && (
                <img
                  src={item.gambar}
                  alt={item.judul}
                  loading="lazy"
                  className="h-52 w-full object-cover"
                />
              )}
              <div className="flex flex-1 flex-col p-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  {item.kategori}
                </span>
                <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {item.judul}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-gray-600 dark:text-slate-300">
                  {item.ringkasan}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-400 dark:text-slate-500">
                    {formatTanggal(item.tanggal)}
                  </span>
                  <Link
                    to={`/berita/${item.id}`}
                    className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Baca selengkapnya →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
