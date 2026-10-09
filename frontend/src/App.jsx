import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Beranda from './pages/Beranda';
import Profil from './pages/Profil';
import Struktur from './pages/Struktur';
import Berita from './pages/Berita';
import BeritaDetail from './pages/BeritaDetail';
import Agenda from './pages/Agenda';
import PengajianSafari from './pages/PengajianSafari';
import Galeri from './pages/Galeri';
import Daftar from './pages/Daftar';
import Kontak from './pages/Kontak';
import TabsDemo from './pages/TabsDemo';
import NotFound from './pages/NotFound';

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
      <Navbar dark={dark} onToggleDark={() => setDark((v) => !v)} />
      <main className="flex-1">
        <div key={location.pathname} className="animate-fade-in">
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
            <Route path="/kontak" element={<Kontak />} />
            <Route path="/demo" element={<TabsDemo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}
