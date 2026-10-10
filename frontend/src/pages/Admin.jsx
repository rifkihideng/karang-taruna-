import { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteData, fetchData, postData, postFormData, putData } from '../lib/api';

const emptyAgenda = {
  nama: '',
  tanggal: '',
  waktu: '',
  tempat: '',
  status: 'terjadwal',
};

const emptyBerita = {
  judul: '',
  kategori: '',
  tanggal: '',
  ringkasan: '',
  isi: '',
  gambar: '',
};

const inputClass =
  'mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white';

function formatDate(value) {
  if (!value) return 'Tanggal tidak tersedia';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date);
}

function formatBulan(key) {
  const [year, month] = key.split('-').map(Number);
  return new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(new Date(year, month - 1, 1));
}

function StatBar({ label, jumlah, total }) {
  const pct = total > 0 ? Math.round((jumlah / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="capitalize text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-semibold text-slate-900 dark:text-white">{jumlah}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div className="h-full rounded-full bg-blue-500 dark:bg-blue-400" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingAgenda, setSavingAgenda] = useState(false);
  const [savingBerita, setSavingBerita] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [stats, setStats] = useState(null);
  const [kegiatan, setKegiatan] = useState([]);
  const [berita, setBerita] = useState([]);
  const [pendaftar, setPendaftar] = useState([]);
  const [rekap, setRekap] = useState(null);
  const [statistik, setStatistik] = useState(null);
  const [newPendaftarCount, setNewPendaftarCount] = useState(0);
  const [pendaftarCutoff, setPendaftarCutoff] = useState(() => {
    const seen = localStorage.getItem('pendaftarLastSeen');
    return seen ? Number(seen) : Date.now();
  });
  const [agendaForm, setAgendaForm] = useState(emptyAgenda);
  const [beritaForm, setBeritaForm] = useState(emptyBerita);
  const [gambarFile, setGambarFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [tab, setTab] = useState('dashboard');

  const loadData = useCallback(async () => {
    const [statsData, kegiatanData, beritaData, pendaftarData, rekapData, statistikData] = await Promise.all([
      fetchData('/stats'),
      fetchData('/kegiatan'),
      fetchData('/berita'),
      fetchData('/anggota/admin/pendaftar'),
      fetchData('/anggota/admin/rekap'),
      fetchData('/anggota/admin/statistik'),
    ]);
    return { statsData, kegiatanData, beritaData, pendaftarData, rekapData, statistikData };
  }, []);

  const applyDashboardData = useCallback(({ statsData, kegiatanData, beritaData, pendaftarData, rekapData, statistikData }) => {
    setStats(statsData);
    setKegiatan(kegiatanData);
    setBerita(beritaData);
    setPendaftar(pendaftarData);
    setRekap(rekapData);
    setStatistik(statistikData);

    const seenRaw = localStorage.getItem('pendaftarLastSeen');
    const seen = seenRaw ? Number(seenRaw) : null;
    const cutoff = seen ?? Date.now();
    const newCount = seen
      ? pendaftarData.filter((p) => new Date(p.created_at).getTime() > seen).length
      : 0;
    setPendaftarCutoff(cutoff);
    setNewPendaftarCount(newCount);
    localStorage.setItem('pendaftarLastSeen', String(Date.now()));
  }, []);

  const reportLoadError = useCallback((err) => {
    setError(err.message || 'Gagal memuat data admin');
    if (err.status === 401) {
      localStorage.removeItem('adminToken');
      setToken(null);
      setNotice('Sesi admin berakhir. Pilih Keluar, lalu masuk kembali.');
    }
  }, []);

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('adminToken');
      return;
    }
    localStorage.setItem('adminToken', token);
    loadData()
      .then(applyDashboardData)
      .catch(reportLoadError)
      .finally(() => setLoading(false));
  }, [token, loadData, applyDashboardData, reportLoadError]);

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);
    try {
      const result = await postData('/auth/login', { password });
      setToken(result.token);
      setPassword('');
    } catch (err) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('adminToken');
    setToken(null);
    setStats(null);
    setKegiatan([]);
    setBerita([]);
    setPendaftar([]);
    setRekap(null);
    setStatistik(null);
    setAgendaForm(emptyAgenda);
    setEditingId(null);
  }

  async function refreshData() {
    setLoading(true);
    setError('');
    setNotice('');
    try {
      applyDashboardData(await loadData());
    } catch (err) {
      reportLoadError(err);
    } finally {
      setLoading(false);
    }
  }

  function resetAgendaForm() {
    setAgendaForm(emptyAgenda);
    setEditingId(null);
  }

  function editAgenda(item) {
    setAgendaForm({
      nama: item.nama || '',
      tanggal: item.tanggal || '',
      waktu: item.waktu || '',
      tempat: item.tempat || '',
      status: item.status || 'terjadwal',
    });
    setEditingId(item.id);
    setError('');
    setNotice('');
  }

  async function saveAgenda(event) {
    event.preventDefault();
    setSavingAgenda(true);
    setError('');
    setNotice('');
    try {
      if (editingId) {
        await putData(`/kegiatan/${editingId}`, agendaForm);
        setNotice('Agenda berhasil diperbarui.');
      } else {
        await postData('/kegiatan', agendaForm);
        setNotice('Agenda berhasil ditambahkan.');
      }
      resetAgendaForm();
      applyDashboardData(await loadData());
    } catch (err) {
      setError(err.message || 'Gagal menyimpan agenda');
    } finally {
      setSavingAgenda(false);
    }
  }

  async function saveBerita(event) {
    event.preventDefault();
    setSavingBerita(true);
    setError('');
    setNotice('');
    try {
      const formData = new FormData();
      formData.append('judul', beritaForm.judul);
      formData.append('kategori', beritaForm.kategori);
      formData.append('tanggal', beritaForm.tanggal);
      formData.append('ringkasan', beritaForm.ringkasan);
      formData.append('isi', beritaForm.isi);
      if (gambarFile) formData.append('gambar', gambarFile);
      await postFormData('/berita', formData);
      setBeritaForm(emptyBerita);
      setGambarFile(null);
      setNotice('Berita berhasil ditambahkan.');
      applyDashboardData(await loadData());
    } catch (err) {
      setError(err.message || 'Gagal menambahkan berita');
    } finally {
      setSavingBerita(false);
    }
  }

  async function removeAgenda(item) {
    if (!window.confirm(`Hapus agenda "${item.nama}"?`)) return;
    setError('');
    setNotice('');
    try {
      await deleteData(`/kegiatan/${item.id}`);
      setKegiatan((items) => items.filter((agenda) => agenda.id !== item.id));
      setNotice('Agenda berhasil dihapus.');
    } catch (err) {
      setError(err.message || 'Gagal menghapus agenda');
    }
  }

  async function removeAnggota(item) {
    if (!window.confirm(`Hapus pendaftar "${item.nama}"?`)) return;
    setError('');
    setNotice('');
    try {
      await deleteData(`/anggota/${item.id}`);
      setPendaftar((items) => items.filter((anggota) => anggota.id !== item.id));
      setNotice('Pendaftar berhasil dihapus.');
      applyDashboardData(await loadData());
    } catch (err) {
      setError(err.message || 'Gagal menghapus pendaftar');
    }
  }

  async function removeBerita(item) {
    if (!window.confirm(`Hapus berita "${item.judul}"?`)) return;
    setError('');
    setNotice('');
    try {
      await deleteData(`/berita/${item.id}`);
      setBerita((items) => items.filter((berita) => berita.id !== item.id));
      setNotice('Berita berhasil dihapus.');
    } catch (err) {
      setError(err.message || 'Gagal menghapus berita');
    }
  }

  function downloadRekapCsv() {
    if (!rekap || !rekap.anggota || rekap.anggota.length === 0) return;
    const header = ['Nama', 'Tipe', 'Jabatan', 'Angkatan', 'Alamat', 'Kontak', 'Minat', 'Status', 'Terdaftar'];
    const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const lines = [header.map(escape).join(',')];
    for (const a of rekap.anggota) {
      lines.push([
        a.nama,
        a.tipe === 'lama' ? 'Lama' : 'Baru',
        a.jabatan,
        a.angkatan,
        a.alamat,
        a.kontak,
        a.minat,
        a.status,
        a.created_at,
      ].map(escape).join(','));
    }
    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rekap-anggota.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setNotice('Rekap CSV berhasil diunduh.');
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
            Karang Taruna RT 02
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Masuk Admin</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Masuk untuk mengelola agenda dan melihat pendaftaran anggota.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password admin
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
              />
            </label>
            {notice && <p className="text-sm text-amber-700 dark:text-amber-300">{notice}</p>}
            {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
            Panel Pengelola
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">Dashboard Admin</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={refreshData}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {loading ? 'Memuat...' : 'Muat ulang'}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Keluar
          </button>
        </div>
      </div>

      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
      {notice && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">{notice}</p>}

      <nav className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'agenda', label: 'Agenda' },
          { id: 'berita', label: 'Berita' },
          { id: 'anggota', label: 'Anggota', badge: newPendaftarCount },
          { id: 'statistik', label: 'Statistik' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === t.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {t.label}
            {t.badge > 0 && (
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  tab === t.id
                    ? 'bg-white/25 text-white'
                    : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300'
                }`}
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <section className={`${tab === 'dashboard' ? '' : 'hidden'} mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4`}>
        {[
          ['Anggota', stats?.anggota],
          ['Kegiatan', stats?.kegiatan],
          ['Berita', stats?.berita],
          ['Galeri', stats?.galeri],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value ?? '—'}</p>
          </div>
        ))}
      </section>

      <section className={`${tab === 'statistik' ? '' : 'hidden'} mt-7 space-y-6`}>
        {!statistik ? (
          <p className="rounded-2xl bg-white p-6 text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
            Memuat statistik pendaftaran…
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ['Total pendaftar', statistik.total],
                ['Bulan ini', statistik.bulanIni],
                ['Menunggu review', statistik.perStatus.find((s) => s.status === 'pending')?.jumlah ?? 0],
                ['Total anggota', rekap?.total],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value ?? '—'}</p>
                </div>
              ))}
            </div>

            {statistik.total === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <p className="text-slate-500 dark:text-slate-400">Belum ada pendaftar.</p>
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pendaftaran per bulan</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">12 bulan terakhir</p>
                  <div className="mt-6 flex items-end gap-1.5 sm:gap-2">
                    {statistik.perBulan.map((b) => {
                      const max = Math.max(1, ...statistik.perBulan.map((x) => x.jumlah));
                      const height = b.jumlah > 0 ? Math.max(8, (b.jumlah / max) * 100) : 2;
                      return (
                        <div key={b.bulan} className="flex flex-1 flex-col items-center gap-1">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{b.jumlah}</span>
                          <div className="flex h-36 w-full items-end justify-center">
                            <div
                              className={`w-full max-w-[42px] rounded-t-md ${
                                b.jumlah > 0 ? 'bg-blue-500 dark:bg-blue-400' : 'bg-slate-200 dark:bg-slate-700'
                              }`}
                              style={{ height: `${height}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">{formatBulan(b.bulan)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Berdasarkan status</h2>
                    <div className="mt-4 space-y-3">
                      {statistik.perStatus.map((s) => (
                        <StatBar key={s.status} label={s.status} jumlah={s.jumlah} total={statistik.total} />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Berdasarkan angkatan</h2>
                    <div className="mt-4 space-y-3">
                      {statistik.perAngkatan.map((a) => (
                        <StatBar key={a.angkatan} label={a.angkatan} jumlah={a.jumlah} total={statistik.total} />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Berdasarkan minat</h2>
                    <div className="mt-4 space-y-3">
                      {statistik.perMinat.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada data minat.</p>
                      ) : (
                        statistik.perMinat.map((m) => (
                          <StatBar key={m.minat} label={m.minat} jumlah={m.jumlah} total={statistik.total} />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </section>

      <section className={`${tab === 'agenda' ? '' : 'hidden'} mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]`}>
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {editingId ? 'Edit agenda' : 'Tambah agenda'}
          </h2>
          <form onSubmit={saveAgenda} className="mt-4 space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Nama kegiatan
              <input
                required
                maxLength={150}
                value={agendaForm.nama}
                onChange={(event) => setAgendaForm({ ...agendaForm, nama: event.target.value })}
                className={inputClass}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Tanggal
                <input
                  type="date"
                  required
                  value={agendaForm.tanggal}
                  onChange={(event) => setAgendaForm({ ...agendaForm, tanggal: event.target.value })}
                  className={inputClass}
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Waktu
                <input
                  type="time"
                  value={agendaForm.waktu}
                  onChange={(event) => setAgendaForm({ ...agendaForm, waktu: event.target.value })}
                  className={inputClass}
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Tempat
              <input
                maxLength={200}
                value={agendaForm.tempat}
                onChange={(event) => setAgendaForm({ ...agendaForm, tempat: event.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Status
              <select
                value={agendaForm.status}
                onChange={(event) => setAgendaForm({ ...agendaForm, status: event.target.value })}
                className={inputClass}
              >
                <option value="terjadwal">Terjadwal</option>
                <option value="selesai">Selesai</option>
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={savingAgenda}
                className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {savingAgenda ? 'Menyimpan...' : editingId ? 'Simpan perubahan' : 'Tambah agenda'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetAgendaForm}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kelola agenda</h2>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              {kegiatan.length} kegiatan
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {kegiatan.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                Belum ada agenda kegiatan.
              </p>
            ) : kegiatan.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                      {item.status === 'selesai' ? 'Selesai' : 'Terjadwal'}
                    </span>
                    <h3 className="mt-1 font-semibold text-slate-900 dark:text-white">{item.nama}</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(item.tanggal)}{item.waktu ? ` · ${item.waktu}` : ''}
                      {item.tempat ? ` · ${item.tempat}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editAgenda(item)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAgenda(item)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${tab === 'berita' ? '' : 'hidden'} mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]`}>
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tambah berita</h2>
          <form onSubmit={saveBerita} className="mt-4 space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Judul berita
              <input
                required
                maxLength={200}
                value={beritaForm.judul}
                onChange={(event) => setBeritaForm({ ...beritaForm, judul: event.target.value })}
                className={inputClass}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Kategori
                <input
                  required
                  maxLength={100}
                  placeholder="Kegiatan Sosial"
                  value={beritaForm.kategori}
                  onChange={(event) => setBeritaForm({ ...beritaForm, kategori: event.target.value })}
                  className={inputClass}
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Tanggal
                <input
                  type="date"
                  required
                  value={beritaForm.tanggal}
                  onChange={(event) => setBeritaForm({ ...beritaForm, tanggal: event.target.value })}
                  className={inputClass}
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Ringkasan
              <textarea
                required
                maxLength={500}
                rows={2}
                value={beritaForm.ringkasan}
                onChange={(event) => setBeritaForm({ ...beritaForm, ringkasan: event.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Isi berita
              <textarea
                required
                rows={4}
                value={beritaForm.isi}
                onChange={(event) => setBeritaForm({ ...beritaForm, isi: event.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Gambar (opsional)
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setGambarFile(event.target.files?.[0] || null)}
                className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-500/10 dark:file:text-blue-300`}
              />
              {gambarFile && (
                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  {gambarFile.name} ({(gambarFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              )}
              <span className="mt-1 block text-xs text-slate-400 dark:text-slate-500">
                Format JPG, PNG, WEBP, GIF, atau AVIF — maksimal 5 MB.
              </span>
            </label>
            <button
              type="submit"
              disabled={savingBerita}
              className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {savingBerita ? 'Menyimpan...' : 'Tambah berita'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kelola berita</h2>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              {berita.length} berita
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {berita.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                Belum ada berita.
              </p>
            ) : berita.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                      {item.kategori || 'Umum'}
                    </span>
                    <h3 className="mt-1 font-semibold text-slate-900 dark:text-white">{item.judul}</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatDate(item.tanggal)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBerita(item)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                  >
                    Hapus
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${tab === 'anggota' ? '' : 'hidden'} mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pendaftar anggota terbaru</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Informasi pendaftar ini hanya tersedia setelah admin masuk.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {newPendaftarCount > 0 && (
              <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-300">
                {newPendaftarCount} baru
              </span>
            )}
            <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
              {pendaftar.length} pendaftar
            </span>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {pendaftar.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400 md:col-span-2">
              Belum ada pendaftaran baru.
            </p>
          ) : pendaftar.map((anggota) => (
            <article key={anggota.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">{anggota.nama}</h3>
                <div className="flex shrink-0 items-center gap-2">
                  {new Date(anggota.created_at).getTime() > pendaftarCutoff && (
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-300">
                      Baru
                    </span>
                  )}
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                    {anggota.status || 'pending'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAnggota(anggota)}
                    aria-label={`Hapus pendaftar ${anggota.nama}`}
                    className="rounded-lg border border-red-200 p-1.5 text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <dl className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                {anggota.kontak && <div><dt className="inline font-medium">Kontak: </dt><dd className="inline">{anggota.kontak}</dd></div>}
                {anggota.alamat && <div><dt className="inline font-medium">Alamat: </dt><dd className="inline">{anggota.alamat}</dd></div>}
                {anggota.minat && <div><dt className="inline font-medium">Minat: </dt><dd className="inline">{anggota.minat}</dd></div>}
                <div><dt className="inline font-medium">Terdaftar: </dt><dd className="inline">{formatDate(anggota.created_at)}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className={`${tab === 'anggota' ? '' : 'hidden'} mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Rekap Anggota</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Rangkuman anggota lama dan anggota yang baru ditambahkan.
            </p>
          </div>
          <button
            type="button"
            onClick={downloadRekapCsv}
            disabled={!rekap || rekap.total === 0}
            className="rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Unduh CSV
          </button>
        </div>

        {!rekap ? (
          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            Memuat rekap anggota...
          </p>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ['Total', rekap.total, 'text-slate-900 dark:text-white'],
                ['Lama', rekap.lama, 'text-slate-900 dark:text-white'],
                ['Baru', rekap.baru, 'text-blue-600 dark:text-blue-400'],
              ].map(([label, value, color]) => (
                <div key={label} className="rounded-2xl border border-slate-200 p-4 text-center dark:border-slate-700">
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    <th className="py-2 pr-4">Nama</th>
                    <th className="py-2 pr-4">Tipe</th>
                    <th className="py-2 pr-4">Jabatan</th>
                    <th className="py-2 pr-4">Angkatan</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rekap.anggota.map((a) => (
                    <tr key={a.id} className="border-b border-slate-100 last:border-0 dark:border-slate-700/60">
                      <td className="py-2.5 pr-4 font-medium text-slate-900 dark:text-white">{a.nama}</td>
                      <td className="py-2.5 pr-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            a.tipe === 'lama'
                              ? 'bg-slate-100 text-slate-700 dark:bg-slate-700/60 dark:text-slate-300'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
                          }`}
                        >
                          {a.tipe === 'lama' ? 'Lama' : 'Baru'}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{a.jabatan || '—'}</td>
                      <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{a.angkatan || '—'}</td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300">{a.status || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

    </div>
  );
}
