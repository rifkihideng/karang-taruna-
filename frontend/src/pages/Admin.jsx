import { useCallback, useEffect, useState } from 'react';
import { deleteData, fetchData, postData, putData } from '../lib/api';

const emptyAgenda = {
  nama: '',
  tanggal: '',
  waktu: '',
  tempat: '',
  status: 'terjadwal',
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

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingAgenda, setSavingAgenda] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [stats, setStats] = useState(null);
  const [kegiatan, setKegiatan] = useState([]);
  const [pendaftar, setPendaftar] = useState([]);
  const [agendaForm, setAgendaForm] = useState(emptyAgenda);
  const [editingId, setEditingId] = useState(null);

  const loadData = useCallback(async () => {
    const [statsData, kegiatanData, pendaftarData] = await Promise.all([
      fetchData('/stats'),
      fetchData('/kegiatan'),
      fetchData('/anggota/admin/pendaftar'),
    ]);
    return { statsData, kegiatanData, pendaftarData };
  }, []);

  const applyDashboardData = useCallback(({ statsData, kegiatanData, pendaftarData }) => {
    setStats(statsData);
    setKegiatan(kegiatanData);
    setPendaftar(pendaftarData);
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
    setPendaftar([]);
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

      <section className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          ['Anggota', stats?.anggota],
          ['Kegiatan', stats?.kegiatan],
          ['Galeri', stats?.galeri],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value ?? '—'}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
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

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pendaftar anggota terbaru</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Informasi pendaftar ini hanya tersedia setelah admin masuk.
            </p>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
            {pendaftar.length} pendaftar
          </span>
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
                <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                  {anggota.status || 'pending'}
                </span>
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

    </div>
  );
}
