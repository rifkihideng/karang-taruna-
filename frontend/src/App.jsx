import { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

const Beranda = lazy(() => import('./pages/Beranda.jsx'));
const Profil = lazy(() => import('./pages/Profil.jsx'));
const Struktur = lazy(() => import('./pages/Struktur.jsx'));
const Berita = lazy(() => import('./pages/Berita.jsx'));
const BeritaDetail = lazy(() => import('./pages/BeritaDetail.jsx'));
const Agenda = lazy(() => import('./pages/Agenda.jsx'));
const PengajianSafari = lazy(() => import('./pages/PengajianSafari.jsx'));
const Galeri = lazy(() => import('./pages/Galeri.jsx'));
const Daftar = lazy(() => import('./pages/Daftar.jsx'));
const Faq = lazy(() => import('./pages/Faq.jsx'));
const TabsDemo = lazy(() => import('./pages/TabsDemo.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-gray-900 dark:bg-slate-900 dark:text-slate-100">
      <LoadingScreen />
      <Navbar dark={dark} onToggleDark={() => setDark((v) => !v)} />
      <main className="flex-1">
        <div key={location.pathname} className="animate-fade-in">
          <Suspense fallback={<RouteFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Beranda />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/struktur" element={<Struktur />} />
              <Route path="/berita" element={<Berita />} />
              <Route path="/berita/:id" element={<BeritaDetail />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/kegiatan/pengajian-safari" element={<PengajianSafari />} />
              <Route path="/galeri" element={<Galeri />} />
              <Route path="/daftar" element={<Daftar />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/demo" element={<TabsDemo />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
