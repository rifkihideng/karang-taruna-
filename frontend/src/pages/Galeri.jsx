import { useFetch } from '../hooks/useFetch';
import Skeleton from '../components/Skeleton';
import Reveal from '../components/Reveal';
import SocialCards from '@/components/ui/card-fan-carousel';

export default function Galeri() {
  const { data, loading, error } = useFetch('/galeri');

  const cards = (data || []).map((photo) => ({
    imgUrl: photo.url,
    alt: photo.judul,
  }));

  return (
    <div className="px-4 py-16">
      <Reveal>
        <div className="mx-auto mb-8 flex max-w-6xl flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_22px_60px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/70 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Galeri Foto</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-gray-600 dark:text-slate-400">
            Dokumentasi kegiatan Karang Taruna RT 02. Setiap momen kami abadikan
            dengan tampilan yang elegan, rapi, dan siap dibagikan.
          </p>
        </div>
      </Reveal>

      {loading ? (
        <div className="mx-auto mt-8 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700"
            >
              <Skeleton className="h-52 w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="mt-8 text-center text-red-500">Gagal memuat galeri: {error}</p>
      ) : (
        <div>
          <Reveal>
            <div className="mx-auto max-w-6xl text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dokumentasi Pengajian Safari Karang Taruna
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                {cards.length} foto kegiatan pengajian safari yang telah terlaksana.
              </p>
            </div>
          </Reveal>
          <SocialCards cards={cards} />
        </div>
      )}
    </div>
  );
}
