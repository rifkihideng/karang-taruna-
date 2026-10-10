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
            <li key={p.id} className="text-sm text-gray-700 dark:text-slate-300">
              {p.nama}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Struktur() {
  const { data, loading, error } = useFetch('/anggota');
  const [open, setOpen] = useState({});

  const list = data || [];
  const inti = list.filter((a) =>
    ['Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara'].includes(a.jabatan)
  );
  const bidangOrder = ['PDD', 'Humas', 'Rohani', 'Olahraga'];
  const bidang = bidangOrder
    .map((nama) => ({ nama, anggota: list.filter((a) => a.jabatan === nama) }))
    .filter((b) => b.anggota.length > 0);
  const anggota = list.filter((a) => a.jabatan === 'Anggota');

  const toggle = (nama) => setOpen((prev) => ({ ...prev, [nama]: !prev[nama] }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
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
        <div className="mt-10 space-y-8">
          {/* Pengurus Inti */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
              Pengurus Inti
            </h2>
            <ul className="space-y-2">
              {inti.map((p) => (
                <IntiItem key={p.id} p={p} />
              ))}
            </ul>
          </section>

          {/* Divisi */}
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

          {/* Anggota */}
          {anggota.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Anggota</h2>
              <ul className="space-y-1.5 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700">
                {anggota.map((p) => (
                  <li key={p.id} className="text-sm text-gray-700 dark:text-slate-300">
                    {p.nama}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
