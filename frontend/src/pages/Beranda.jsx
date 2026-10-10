import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { formatTanggal } from '../lib/format';
import Skeleton from '../components/Skeleton';
import CountUp from '../components/CountUp';
import Reveal from '../components/Reveal';

const statItems = [
  { key: 'anggota', label: 'Anggota' },
  { key: 'kegiatan', label: 'Kegiatan' },
  { key: 'berita', label: 'Berita' },
  { key: 'galeri', label: 'Galeri' },
];

export default function Beranda() {
  const { data: stats, loading: loadingStats } = useFetch('/stats');
  const { data: berita, loading: loadingBerita } = useFetch('/berita');

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),transparent_30%),linear-gradient(135deg,#f8fbff_0%,#eef4ff_45%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.22),transparent_28%),linear-gradient(135deg,#020817_0%,#0f172a_45%,#111827_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <Reveal className="text-center md:text-left">
              <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
                Karang Taruna RT 02
              </span>
              <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.04em] text-gray-900 md:text-5xl dark:text-white">
                Wadah pemuda-pemudi yang aktif, kreatif, dan berdampak.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-gray-600 dark:text-slate-300 md:mx-0">
                Menggerakkan semangat kebersamaan, memberdayakan potensi generasi muda,
                dan membangun lingkungan yang lebih rukun, sehat, dan inovatif.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
                <Link
                  to="/daftar"
                  className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-[0_18px_30px_-18px_rgba(59,130,246,0.8)] transition-all duration-300 hover:bg-blue-700 hover:shadow-[0_22px_40px_-18px_rgba(59,130,246,0.9)]"
                >
                  Daftar Anggota
                </Link>
                <Link
                  to="/agenda"
                  className="rounded-full border border-gray-200 bg-white/80 px-6 py-3 font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Lihat Agenda
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="relative">
              <div className="absolute inset-0 -z-10 rounded-[30px] bg-gradient-to-br from-blue-200/40 via-indigo-100/30 to-sky-100/20 blur-2xl dark:from-blue-500/20 dark:via-indigo-500/10 dark:to-sky-500/10" />
              <div className="rounded-[30px] border border-white/60 bg-white/70 p-4 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/70">
                <div className="overflow-hidden rounded-[24px] bg-slate-100 dark:bg-slate-800">
                  <img
                    src="/dokumentasi/pengajian-safari-pemuda-pemudi.jpeg"
                    alt="Pengajian Safari Pemuda-Pemudi"
                    fetchPriority="high"
                    decoding="async"
                    className="h-[360px] w-full object-cover md:h-[430px]"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/80">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      Kegiatan utama
                    </p>
                    <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                      Pengajian Safari Pemuda-Pemudi
                    </p>
                  </div>
                  <Link
                    to="/kegiatan/pengajian-safari"
                    className="rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section className="mx-auto max-w-6xl px-4 py-8 md:-mt-6">
        <Reveal>
        <div className="grid grid-cols-2 gap-4 rounded-[28px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:grid-cols-4 dark:border-slate-700/80 dark:bg-slate-900/80">
          {statItems.map((s) => (
            <div
              key={s.key}
              className="rounded-2xl border border-slate-100 bg-slate-50/90 p-4 text-center transition-transform duration-300 hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800/80"
            >
              <div className="text-3xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
                {loadingStats ? (
                  <Skeleton className="mx-auto h-8 w-10" />
                ) : (
                  <CountUp end={stats?.[s.key] ?? 0} />
                )}
              </div>
              <div className="mt-2 text-sm font-medium text-gray-500 dark:text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
        </Reveal>
      </section>

      {/* Berita terbaru */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Berita Terbaru</h2>
        </div>

        {loadingBerita ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-56 w-full rounded-2xl" />
            ))}
          </div>
        ) : !berita || berita.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-gray-500 ring-1 ring-gray-100 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
            Belum ada berita.
          </p>
        ) : (
          <Reveal>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {berita.slice(0, 3).map((item) => (
                <article
                  key={item.id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700"
                >
                  {item.gambar && (
                    <img
                      src={item.gambar}
                      alt={item.judul}
                      loading="lazy"
                      decoding="async"
                      className="h-44 w-full object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                      {item.kategori}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {item.judul}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-gray-600 dark:text-slate-300">
                      {item.ringkasan}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3 pt-2">
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
          </Reveal>
        )}
      </section>

    </div>
  );
}
