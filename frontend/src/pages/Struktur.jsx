import { User } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import Skeleton from '../components/Skeleton';
import Reveal from '../components/Reveal';

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

function BranchRow({ items, widthClass = '' }) {
  return (
    <div className="flex flex-col items-center md:flex-row md:items-start md:justify-center">
      {items.map((node, i) => (
        <div key={i} className={`flex w-full flex-col items-center ${widthClass}`}>
          <div className="relative h-6 w-full md:h-8">
            <div
              className="absolute top-0 hidden h-[2px] bg-gray-300 dark:bg-slate-600 md:block"
              style={{
                left: i === 0 ? '50%' : 0,
                right: i === items.length - 1 ? '50%' : 0,
              }}
            />
            <div className="absolute left-1/2 top-0 h-6 w-[2px] -translate-x-1/2 bg-gray-300 dark:bg-slate-600 md:h-8" />
          </div>
          {node}
        </div>
      ))}
    </div>
  );
}

export default function Struktur() {
  const { data, loading, error } = useFetch('/anggota');

  const list = data || [];
  const ketua = list.filter((a) => a.jabatan === 'Ketua')[0] || null;
  const inti = list.filter((a) =>
    ['Wakil Ketua', 'Sekretaris', 'Bendahara'].includes(a.jabatan)
  );
  const bidangOrder = ['PDD', 'Humas', 'Rohani', 'Olahraga', 'Anggota'];
  const bidang = bidangOrder
    .map((nama) => ({ nama, anggota: list.filter((a) => a.jabatan === nama) }))
    .filter((b) => b.anggota.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Reveal>
        <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          Struktur Organisasi
        </h1>
        <p className="mt-2 text-center text-gray-600 dark:text-slate-400">
          Susunan kepengurusan Karang Taruna RT 02.
        </p>
      </Reveal>

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
      ) : list.length === 0 ? (
        <p className="mt-8 text-center text-gray-500 dark:text-slate-400">
          Belum ada data pengurus.
        </p>
      ) : (
        <div className="mt-12">
          {/* Ketua */}
          {ketua && (
            <div className="flex flex-col items-center">
              <PersonCard p={ketua} />
              {inti.length > 0 && (
                <div className="h-8 w-[2px] bg-gray-300 dark:bg-slate-600" />
              )}
            </div>
          )}

          {/* Wakil Ketua, Sekretaris, Bendahara */}
          {inti.length > 0 && (
            <BranchRow
              items={inti.map((p) => (
                <PersonCard key={p.id} p={p} />
              ))}
              widthClass="md:w-56"
            />
          )}

          {/* Bidang */}
          {bidang.length > 0 && (
            <>
              {inti.length > 0 && (
                <div className="flex justify-center">
                  <div className="h-8 w-[2px] bg-gray-300 dark:bg-slate-600" />
                </div>
              )}
              <BranchRow
                items={bidang.map((b) => (
                  <div
                    key={b.nama}
                    className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm ring-1 ring-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:ring-slate-700 md:w-44"
                  >
                    <h3 className="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                      {b.nama}
                    </h3>
                    <div className="mt-3 flex flex-col gap-2">
                      {b.anggota.map((p) => (
                        <div
                          key={p.id}
                          className="rounded-lg bg-slate-50 px-2 py-1.5 text-sm font-medium text-gray-700 dark:bg-slate-900 dark:text-slate-300"
                        >
                          {p.nama}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                widthClass="md:w-52"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
