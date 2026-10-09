import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';

const navigasi = [
  { to: '/', label: 'Beranda' },
  { to: '/profil', label: 'Profil' },
  { to: '/struktur', label: 'Struktur' },
  { to: '/berita', label: 'Berita' },
];

const informasi = [
  { to: '/agenda', label: 'Agenda' },
  { to: '/galeri', label: 'Galeri' },
  { to: '/daftar', label: 'Daftar' },
  { to: '/kontak', label: 'Kontak' },
];

const kontak = [
  { icon: MapPin, text: 'Jl. Merdeka No. 3, RT 02/RW 012' },
  { icon: Mail, text: 'karangtaruna.rt02@example.com' },
  { icon: Phone, text: '0812-3456-7890' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200/80 bg-[linear-gradient(135deg,#f8fbff_0%,#f1f5f9_52%,#eef4ff_100%)] dark:border-slate-800 dark:bg-[linear-gradient(135deg,#020817_0%,#0f172a_55%,#111827_100%)]">
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-500/10" />
      <div className="relative mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.1fr]">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white"
            >
              <img
                src="/logo-karang-taruna.jpeg"
                alt="Logo Karang Taruna RT 02"
                className="h-12 w-12 shrink-0 rounded-2xl object-cover shadow-md ring-1 ring-white/80 dark:ring-slate-700"
              />
              <span>
                <span className="block">Karang Taruna</span>
                <span className="mt-0.5 block text-xs font-medium tracking-[0.14em] text-blue-600 dark:text-blue-400">
                  RT 02 · RW 012
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-600 dark:text-slate-400">
              Menggerakkan potensi generasi muda melalui kebersamaan, kreativitas,
              dan kepedulian untuk lingkungan yang rukun dan berdaya.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://instagram.com/karangtaruna.rt02"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-gray-500 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:text-blue-400"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@karangtarunart02"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-gray-500 shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:text-red-400"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-900 dark:text-white">
              Navigasi
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-gray-600 dark:text-slate-400">
              {navigasi.map((m) => (
                <li key={m.to}>
                  <Link
                    to={m.to}
                    className="transition hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-900 dark:text-white">
              Informasi
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-gray-600 dark:text-slate-400">
              {informasi.map((m) => (
                <li key={m.to}>
                  <Link
                    to={m.to}
                    className="transition hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-900 dark:text-white">
              Kontak
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-gray-600 dark:text-slate-400">
              {kontak.map((k) => (
                <li key={k.text} className="flex items-start gap-3">
                  <k.icon
                    size={16}
                    className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                  />
                  <span className="leading-6">{k.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-slate-200/80 bg-white/40 py-5 text-center text-xs text-gray-500 dark:border-slate-800 dark:bg-slate-950/20 dark:text-slate-500">
        © {new Date().getFullYear()} Karang Taruna RT 02/RW 012 · Berkarya dan bertumbuh bersama.
      </div>
    </footer>
  );
}
