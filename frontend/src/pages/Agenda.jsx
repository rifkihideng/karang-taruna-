import { Calendar, Clock, MapPin } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { formatTanggal } from '../lib/format';
import Skeleton from '../components/Skeleton';

const statusStyle = {
  terjadwal: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  selesai: 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-300',
};

const statusLabel = {
  terjadwal: 'Terjadwal',
  selesai: 'Selesai',
};

export default function Agenda() {
  const { data: kegiatan, loading, error } = useFetch('/kegiatan');

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agenda Kegiatan</h1>
      <p className="mt-2 text-gray-600 dark:text-slate-400">
        Jadwal kegiatan Karang Taruna RT 02 yang akan datang maupun yang sudah terlaksana.
      </p>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-5 w-2/3" />
              <Skeleton className="mt-3 h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="mt-8 text-red-500">Gagal memuat data: {error}</p>
      ) : kegiatan && kegiatan.length === 0 ? (
        <p className="mt-8 text-gray-500 dark:text-slate-400">Belum ada agenda kegiatan.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {(kegiatan || []).map((k) => (
            <article
              key={k.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800 dark:ring-slate-700"
            >
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  statusStyle[k.status] || statusStyle.terjadwal
                }`}
              >
                {statusLabel[k.status] || k.status}
              </span>
              <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{k.nama}</h2>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  {formatTanggal(k.tanggal)}
                </span>
                {k.waktu && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} />
                    {k.waktu}
                  </span>
                )}
                {k.tempat && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    {k.tempat}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
