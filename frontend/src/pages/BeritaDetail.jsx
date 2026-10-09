import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { formatTanggal } from '../lib/format';
import Skeleton from '../components/Skeleton';

export default function BeritaDetail() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/berita/${id}`);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-6 h-3 w-24" />
        <Skeleton className="mt-3 h-9 w-3/4" />
        <Skeleton className="mt-6 h-72 w-full" />
        <Skeleton className="mt-6 h-4 w-full" />
        <Skeleton className="mt-3 h-4 w-5/6" />
        <Skeleton className="mt-3 h-4 w-2/3" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-red-500">
          Berita tidak ditemukan{error ? `: ${error}` : ''}.
        </p>
        <Link
          to="/berita"
          className="mt-4 inline-block font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Kembali ke Berita
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link
        to="/berita"
        className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Kembali ke Berita
      </Link>
      <span className="mt-6 block text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
        {data.kategori}
      </span>
      <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{data.judul}</h1>
      <p className="mt-2 text-sm text-gray-400 dark:text-slate-500">
        {formatTanggal(data.tanggal)}
      </p>
      <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-slate-300">
        {data.isi}
      </p>
    </article>
  );
}
