import { useState } from 'react';
import { ChevronDown, User } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import Skeleton from '../components/Skeleton';
import Reveal from '../components/Reveal';

function IntiItem({ p }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <User size={18} />
        </span>
        <span className="truncate font-medium text-gray-900 dark:text-white">{p.nama}</span>
      </div>
      <span className="shrink-0 text-sm text-gray-500 dark:text-slate-400">{p.jabatan}</span>
    </li>
  );
}

function DivisiGroup({ nama, anggota, open, onToggle }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="font-semibold text-gray-900 dark:text-white">Divisi {nama}</span>
        <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
          <span>{anggota.length} anggota</span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>
      {open && (
        <ul className="space-y-2 border-t border-gray-100 px-4 py-3 dark:border-slate-700">
          {anggota.map((p) => (
            <li key={p.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
              <User size={14} className="shrink-0 text-blue-500 dark:text-blue-400" />
              <span>{p.nama}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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

function GrupBox({ nama, anggota }) {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm ring-1 ring-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:ring-slate-700 md:w-44">
      <h3 className="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
        {nama}
      </h3>
      <div className="mt-3 flex flex-col gap-2">
        {anggota.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1.5 text-sm font-medium text-gray-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <User size={14} className="shrink-0 text-blue-500 dark:text-blue-400" />
            <span className="truncate">{p.nama}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Struktur() {
  const { data, loading, error } = useFetch('/anggota');
  const [open, setOpen] = useState({});

  const list = data || [];
  const pengurusInti = list.filter((a) =>
    ['Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara'].includes(a.jabatan)
  );
  const ketua = list.filter((a) => a.jabatan === 'Ketua')[0] || null;
  const inti = list.filter((a) =>
    ['Wakil Ketua', 'Sekretaris', 'Bendahara'].includes(a.jabatan)
  );
  const bidangOrder = ['PDD', 'Humas', 'Rohani', 'Olahraga'];
  const bidang = bidangOrder
    .map((nama) => ({ nama, anggota: list.filter((a) => a.jabatan === nama) }))
    .filter((b) => b.anggota.length > 0);
  const anggota = list.filter((a) => a.jabatan === 'Anggota');

  const toggle = (nama) => setOpen((prev) => ({ ...prev, [nama]: !prev[nama] }));

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
        <div className="mt-10 space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <p className="mt-8 text-center text-red-500">Gagal memuat data: {error}</p>
      ) : list.length === 0 ? (
        <p className="mt-8 text-center text-gray-500 dark:text-slate-400">
          Belum ada data pengurus.
        </p>
      ) : (
        <>
          {/* Mobile: list + accordion */}
          <div className="mt-10 space-y-8 md:hidden">
            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                Pengurus Inti
              </h2>
              <ul className="space-y-2">
                {pengurusInti.map((p) => (
                  <IntiItem key={p.id} p={p} />
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Divisi</h2>
              <div className="space-y-2">
                {bidang.map((b) => (
                  <DivisiGroup
                    key={b.nama}
                    nama={b.nama}
                    anggota={b.anggota}
                    open={Boolean(open[b.nama])}
                    onToggle={() => toggle(b.nama)}
                  />
                ))}
              </div>
            </section>

            {anggota.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Anggota</h2>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {anggota.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <User size={16} />
                      </span>
                      <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {p.nama}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Desktop: bagan organisasi */}
          <div className="mt-12 hidden md:block">
            {ketua && (
              <div className="flex flex-col items-center">
                <PersonCard p={ketua} />
                {inti.length > 0 && (
                  <div className="h-8 w-[2px] bg-gray-300 dark:bg-slate-600" />
                )}
              </div>
            )}

            {inti.length > 0 && (
              <BranchRow
                items={inti.map((p) => (
                  <PersonCard key={p.id} p={p} />
                ))}
                widthClass="md:w-56"
              />
            )}

            {(bidang.length > 0 || anggota.length > 0) && (
              <>
                {inti.length > 0 && (
                  <div className="flex justify-center">
                    <div className="h-8 w-[2px] bg-gray-300 dark:bg-slate-600" />
                  </div>
                )}
                <BranchRow
                  items={[
                    ...bidang.map((b) => (
                      <GrupBox key={b.nama} nama={b.nama} anggota={b.anggota} />
                    )),
                    ...(anggota.length > 0
                      ? [<GrupBox key="Anggota" nama="Anggota" anggota={anggota} />]
                      : []),
                  ]}
                  widthClass="md:w-52"
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
