import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
    `relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'text-blue-700 dark:text-blue-300'
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
          {links.map((l, i) => {
            const Icon = l.icon;
            return (
              <motion.li
                key={l.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.06 * i, ease: 'easeOut' }}
              >
                <NavLink to={l.to} className={desktopNavClass}>
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-lg bg-blue-50 dark:bg-blue-500/10"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                      <motion.span
                        className="relative z-10 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      >
                        <Icon size={18} />
                        <span>{l.label}</span>
                      </motion.span>
                    </>
                  )}
                </NavLink>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: 0.3, ease: 'easeInOut' }, opacity: { duration: 0.2 } }}
            className="overflow-hidden md:hidden"
          >
            <ul className="border-t border-gray-100 px-4 py-2 dark:border-slate-800">
              {links.map((l, i) => {
                const Icon = l.icon;
                return (
                  <motion.li
                    key={l.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25, delay: 0.04 * i }}
                  >
                    <NavLink to={l.to} onClick={() => setOpen(false)} className={navClass}>
                      <Icon size={18} />
                      <span>{l.label}</span>
                    </NavLink>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
