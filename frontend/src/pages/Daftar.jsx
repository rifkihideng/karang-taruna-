import { useState } from 'react';
import { postData } from '../lib/api';

const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/LepsHGrmCX8FrvzNP4w0z5';

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/20';

export default function Daftar() {
  const [form, setForm] = useState({ nama: '', alamat: '', kontak: '' });
  const [status, setStatus] = useState('idle');
  const [pesan, setPesan] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setPesan('');
    try {
      await postData('/anggota', form);
      window.location.href = WHATSAPP_GROUP_URL;
    } catch (err) {
      setStatus('error');
      setPesan(err.message || 'Terjadi kesalahan, coba lagi.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pendaftaran Anggota</h1>
      <p className="mt-2 text-gray-600 dark:text-slate-400">
        Bergabunglah bersama Karang Taruna RT 02. Isi formulir di bawah ini.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700"
      >
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            required
            maxLength={100}
            value={form.nama}
            onChange={handleChange}
            placeholder="Nama Anda"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Alamat
          </label>
          <input
            id="alamat"
            name="alamat"
            type="text"
            maxLength={200}
            value={form.alamat}
            onChange={handleChange}
            placeholder="Alamat tinggal"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="kontak" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            No. WhatsApp / Telepon
          </label>
          <input
            id="kontak"
            name="kontak"
            type="tel"
            maxLength={30}
            value={form.kontak}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? 'Mengirim…' : 'Daftar Sekarang'}
        </button>

        {pesan && (
          <p
            className={`text-sm ${
              status === 'error'
                ? 'text-red-500 dark:text-red-400'
                : 'text-blue-600 dark:text-blue-400'
            }`}
          >
            {pesan}
          </p>
        )}
      </form>
    </div>
  );
}
