import { useEffect, useState } from 'react';

// Layar loading ringan: logo + spinner. Ditampilkan sesaat saat aplikasi
// pertama kali dimuat, lalu memudar dengan halus.
export default function LoadingScreen({ minDuration = 2000 }) {
  const [phase, setPhase] = useState('visible'); // visible | fading | hidden

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase('fading'), minDuration);
    const hideTimer = setTimeout(() => setPhase('hidden'), minDuration + 500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [minDuration]);

  if (phase === 'hidden') return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 transition-opacity duration-500 dark:bg-slate-900 ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="absolute -inset-4 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
        <span className="absolute inset-0 animate-pulse rounded-full bg-blue-500/10" />
        <img
          src="/logo-karang-taruna.jpeg"
          alt="Logo Karang Taruna RT 02"
          className="relative h-20 w-20 rounded-full object-cover shadow-md"
        />
      </div>
      <p className="animate-fade-in mt-6 text-lg font-bold text-gray-900 dark:text-white">
        Karang Taruna <span className="text-blue-600 dark:text-blue-400">RT 02</span>
      </p>
      <p className="mt-2 text-sm font-medium tracking-wide text-gray-600 dark:text-slate-300">
        Sehat, Rukun, Berdaya Saing
      </p>
      <p className="mt-8 text-sm text-gray-500 dark:text-slate-400">
        Memuat<span className="animate-pulse">...</span>
      </p>
    </div>
  );
}
