import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import Skeleton from '../components/Skeleton';
import { User } from 'lucide-react';

const visiMisi = [
  {
    judul: 'Visi',
    isi: 'Menjadi wadah pengembangan pemuda dan pemudi yang aktif, inovatif, serta berkontribusi nyata dalam menciptakan lingkungan RT 02 yang sehat, rukun, dan berdaya saing.',
  },
  {
    judul: 'Misi',
    isi: 'Menguatkan semangat kebersamaan, mendorong partisipasi aktif dalam kegiatan sosial dan pemberdayaan masyarakat, mengembangkan potensi anggota, serta menjaga persatuan dan kerukunan antarwarga.',
  },
];

export default function Profil() {
  const { data: anggota, loading, error } = useFetch('/anggota');

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profil Organisasi</h1>
      <p className="mt-2 max-w-3xl text-base leading-7 text-gray-600 dark:text-slate-400">
        Karang Taruna RT 02 merupakan organisasi kepemudaan yang berperan sebagai wadah
        pengembangan potensi generasi muda dalam lingkungan RT 02/RW 012. Dengan semangat
        kebersamaan, inovasi, dan kepedulian sosial, kami berkomitmen untuk mendorong
        partisipasi aktif anggota dalam kegiatan pemberdayaan masyarakat, pendidikan,
        seni, olahraga, serta pembangunan lingkungan yang lebih maju dan harmonis.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {visiMisi.map((v) => (
          <div
            key={v.judul}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800 dark:ring-slate-700"
          >
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{v.judul}</h2>
            <p className="mt-2 text-gray-600 dark:text-slate-300">{v.isi}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Struktur Pengurus</h2>
        <Link
          to="/struktur"
          className="text-sm font-semibold text-blue-600 transition hover:underline dark:text-blue-400"
        >
          Lihat bagan →
        </Link>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700"
            >
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="mt-4 text-red-500">Gagal memuat data: {error}</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {(anggota || []).map((a) => {
            const Icon = User;
            return (
              <div
                key={a.id}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800 dark:ring-slate-700"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{a.nama}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{a.jabatan}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
