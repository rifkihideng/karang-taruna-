import { User } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import Skeleton from '../components/Skeleton';

function PersonCard({ p }) {
  return (
    <div className="w-52 rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800 dark:ring-slate-700">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        <User size={24} />
      </div>
      <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">{p.nama}</h3>
      <p className="text-sm text-gray-500 dark:text-slate-400">{p.jabatan}</p>
    </div>
  );
}

function SectionTitle({ jabatan }) {
  return (
    <div className="relative pb-2">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{jabatan}</h2>
      <span className="absolute bottom-0 left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full bg-blue-500/70" />
    </div>
  );
}

function Connector({ className = '' }) {
  return <div className={`rounded-full bg-gray-400 dark:bg-slate-500 ${className}`} />;
}

export default function Struktur() {
  const { data, loading, error } = useFetch('/anggota');

  const list = data || [];
  const ketua = list.filter((a) => a.jabatan === 'Ketua');
  const inti = list.filter((a) =>
    ['Wakil Ketua', 'Sekretaris', 'Bendahara'].includes(a.jabatan)
  );
  const bidangOrder = ['PDD', 'Humas', 'Rohani', 'Olahraga', 'Anggota'];
  const bidang = bidangOrder
    .map((nama) => ({ nama, anggota: list.filter((a) => a.jabatan === nama) }))
    .filter((b) => b.anggota.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
        Struktur Organisasi
      </h1>
      <p className="mt-2 text-center text-gray-600 dark:text-slate-400">
        Susunan kepengurusan Karang Taruna RT 02.
      </p>

      {loading ? (
        <div className="mt-12 flex flex-col items-center space-y-6">
          <Skeleton className="h-28 w-56" />
          <div className="flex gap-8">
            <Skeleton className="h-28 w-52" />
            <Skeleton className="h-28 w-52" />
          </div>
        </div>
      ) : error ? (
        <p className="mt-8 text-center text-red-500">Gagal memuat data: {error}</p>
      ) : (
        <div className="mt-12">
          {/* Ketua */}
          <div className="flex flex-col items-center">
            <PersonCard p={ketua[0]} />
            <Connector className="h-10 w-[2px]" />
            <Connector className="h-[2px] w-64 max-w-full" />
          </div>

          {/* Wakil Ketua, Sekretaris, Bendahara */}
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {inti.map((p) => (
                <div key={p.id} className="flex flex-col items-center">
                  <Connector className="h-6 w-[2px]" />
                  <PersonCard p={p} />
                </div>
              ))}
            </div>
            <Connector className="h-10 w-[2px]" />
            <Connector className="h-[2px] w-72 max-w-full" />
          </div>

          {/* Bidang */}
          {bidang.map((b) => (
            <div key={b.nama} className="mt-12 flex flex-col items-center">
              <SectionTitle jabatan={b.nama} />
              <div className="mt-5 flex flex-wrap justify-center gap-6">
                {b.anggota.map((p) => (
                  <PersonCard key={p.id} p={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
