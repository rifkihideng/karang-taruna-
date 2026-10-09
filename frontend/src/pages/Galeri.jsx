import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Eye, X } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { formatTanggal } from '../lib/format';
import Skeleton from '../components/Skeleton';
import Reveal from '../components/Reveal';

export default function Galeri() {
  const { data, loading, error } = useFetch('/galeri');
  const [active, setActive] = useState(null);

  const galleryGroups = data && data.length ? [{ id: 'dokumentasi-safari', judul: 'Dokumentasi Kegiatan Pengajian Safari', photos: data.slice(0, 4) }] : [];

  const activePhotos = active ? galleryGroups[active.groupIndex]?.photos || [] : [];
  const activeItem = activePhotos[active?.photoIndex ?? 0];

  const close = () => setActive(null);
  const next = () => {
    if (!active) return;
    const total = activePhotos.length;
    if (!total) return;
    setActive((prev) => ({ ...prev, photoIndex: (prev.photoIndex + 1) % total }));
  };
  const prev = () => {
    if (!active) return;
    const total = activePhotos.length;
    if (!total) return;
    setActive((prev) => ({ ...prev, photoIndex: (prev.photoIndex - 1 + total) % total }));
  };

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, activePhotos.length]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Reveal>
      <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_22px_60px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/70 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Galeri Foto</h1>
        </div>
        <p className="max-w-xl text-sm leading-6 text-gray-600 dark:text-slate-400">
          Dokumentasi kegiatan Karang Taruna RT 02. Setiap momen kami abadikan dengan tampilan yang elegan, rapi, dan siap dibagikan.
        </p>
      </div>
      </Reveal>

      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        <p className="mt-8 text-red-500">Gagal memuat galeri: {error}</p>
      ) : (
        <div className="mt-8">
          {galleryGroups.map((group) => (
            <div
              key={group.id}
              className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96),rgba(255,255,255,0.98))] p-3 shadow-[0_30px_80px_-36px_rgba(15,23,42,0.48)] ring-1 ring-slate-200/80 dark:border-slate-700 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,23,42,0.9),rgba(15,23,42,0.96))] dark:ring-slate-700"
            >
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
                {group.photos.map((photo, photoIndex) => (
                  <div
                    key={`${group.id}-${photoIndex}`}
                    className="group relative mb-4 block w-full overflow-hidden rounded-[24px] bg-slate-100 shadow-[0_22px_45px_-32px_rgba(15,23,42,0.65)] ring-1 ring-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_65px_-30px_rgba(37,99,235,0.4)] dark:ring-slate-700"
                  >
                    <img
                      src={photo.url}
                      alt={photo.judul}
                      className="w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-105"
                      style={{
                        filter: 'contrast(1.04) saturate(1.08)',
                        aspectRatio: photoIndex % 3 === 0 ? '4 / 5' : photoIndex % 3 === 1 ? '3 / 4' : '5 / 6',
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="rounded-full border border-white/35 bg-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                        Gallery
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActive({ groupIndex: 0, photoIndex })}
                          aria-label={`Lihat ${photo.judul}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white hover:text-slate-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <a
                          href={photo.url}
                          download
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Unduh ${photo.judul}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white hover:text-slate-900"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="flex items-center justify-between gap-3">
                        <span className="line-clamp-1 text-sm font-medium text-white">{photo.judul}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 px-1 pb-1">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{group.judul}</h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    Dokumentasi kegiatan karang taruna RT 02
                  </p>
                </div>
                <span className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-lg shadow-blue-500/20">
                  {group.photos.length} foto
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {active && activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="animate-modal-in relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeItem.url}
              alt={activeItem.judul}
              className="max-h-[80vh] w-full rounded-[24px] border border-white/10 bg-slate-100 object-contain shadow-[0_35px_90px_rgba(15,23,42,0.5)]"
              style={{ filter: 'contrast(1.05) saturate(1.08)' }}
            />
            <button
              onClick={close}
              aria-label="Tutup"
              className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition hover:scale-105 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={prev}
              aria-label="Sebelumnya"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Berikutnya"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/45 px-4 py-3 text-white backdrop-blur-sm">
              <p className="text-sm font-medium">
                {activeItem.judul}
                {activeItem.tanggal && ` · ${formatTanggal(activeItem.tanggal)}`}
              </p>
              <a
                href={activeItem.url}
                download
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white hover:text-slate-900"
              >
                <Download className="h-3.5 w-3.5" />
                Unduh
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
