import { useState } from 'react';
import { postData } from '../lib/api';

const info = [
  { judul: 'Alamat', isi: 'Jl. Merdeka No. 3, RT 02/RW 012, Kelurahan Contoh' },
  { judul: 'Email', isi: 'karangtaruna.rt02@example.com' },
  { judul: 'Telepon / WhatsApp', isi: '0812-3456-7890' },
];

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/20';

export default function Kontak() {
  const [form, setForm] = useState({ nama: '', email: '', pesan: '' });
  const [status, setStatus] = useState('idle');
  const [pesan, setPesan] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setPesan('');
    try {
      const res = await postData('/kontak', form);
      setStatus('success');
      setPesan(res.message || 'Pesan berhasil dikirim!');
      setForm({ nama: '', email: '', pesan: '' });
    } catch (err) {
      setStatus('error');
      setPesan(err.message || 'Terjadi kesalahan, coba lagi.');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hubungi Kami</h1>
      <p className="mt-2 text-gray-600 dark:text-slate-400">
        Punya pertanyaan, saran, atau ingin bergabung? Kirim pesan kepada kami.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          {info.map((x) => (
            <div
              key={x.judul}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800 dark:ring-slate-700"
            >
              <h2 className="font-semibold text-blue-600 dark:text-blue-400">{x.judul}</h2>
              <p className="mt-1 text-gray-600 dark:text-slate-300">{x.isi}</p>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 dark:bg-slate-800 dark:ring-slate-700"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                Nama
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                required
                value={form.nama}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="pesan" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                Pesan
              </label>
              <textarea
                id="pesan"
                name="pesan"
                rows="4"
                required
                value={form.pesan}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'loading' ? 'Mengirim…' : 'Kirim Pesan'}
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
          </div>
        </form>
      </div>
    </div>
  );
}
