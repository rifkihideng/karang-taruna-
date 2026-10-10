import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Bell,
  FileText,
  Home,
  Image as ImageIcon,
  User,
  UserPlus,
} from 'lucide-react';

const links = [
  { to: '/', label: 'Beranda', icon: Home },
  { to: '/profil', label: 'Profil', icon: User },
  { to: '/berita', label: 'Berita', icon: FileText },
  { to: '/agenda', label: 'Agenda', icon: Bell },
  { to: '/galeri', label: 'Galeri', icon: ImageIcon },
  { to: '/daftar', label: 'Daftar', icon: UserPlus },
];

export default function Navbar({ dark, onToggleDark }) {
  const [open, setOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    }`;

  const desktopNavClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/70 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-base font-bold tracking-tight text-gray-900 dark:text-white sm:text-lg"
        >
          <img
            src="/logo-karang-taruna.jpeg"
            alt="Logo Karang Taruna RT 02"
            className="h-10 w-10 shrink-0 rounded-lg object-cover"
          />
          Karang Taruna <span className="text-gray-400 dark:text-slate-500">RT 02</span>
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleDark}
            aria-label="Ganti tema"
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {dark ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <circle cx="12" cy="12" r="4" />
                <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            <span className={`hamburger ${open ? 'hamburger--open' : ''}`}>
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </span>
          </button>
        </div>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <li key={l.to}>
                <NavLink to={l.to} className={desktopNavClass}>
                  <Icon size={18} />
                  <span>{l.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {open && (
        <div className="animate-fade-in overflow-hidden border-t border-gray-100 px-4 py-2 md:hidden dark:border-slate-800">
          <ul>
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <li key={l.to}>
                  <NavLink to={l.to} onClick={() => setOpen(false)} className={navClass}>
                    <Icon size={18} />
                    <span>{l.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
