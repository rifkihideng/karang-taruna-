import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
      <p className="text-7xl font-extrabold text-blue-600 dark:text-blue-400">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 text-gray-500 dark:text-slate-400">
        Maaf, halaman yang Anda cari tidak ada atau sudah dipindah.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 hover:shadow-md"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
