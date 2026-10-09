import { Link } from 'react-router-dom';

export default function Agenda() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agenda Kegiatan</h1>
      <p className="mt-2 text-gray-600 dark:text-slate-400">
        Informasi kegiatan Karang Taruna RT 02.
      </p>

      <article className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          Kegiatan
        </span>
        <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
          Pengajian Safari Pemuda-Pemudi
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">
          Kegiatan pengajian sebagai wadah silaturahmi, mempererat kebersamaan, dan
          meningkatkan nilai keagamaan pemuda-pemudi Karang Taruna RT 02.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          <Link
            to="/kegiatan/pengajian-safari"
            className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Baca selengkapnya →
          </Link>
          <Link
            to="/galeri"
            className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Lihat dokumentasi →
          </Link>
        </div>
      </article>
    </div>
  );
}
