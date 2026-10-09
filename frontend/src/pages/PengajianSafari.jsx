import { Link } from 'react-router-dom';

export default function PengajianSafari() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16">
      <Link
        to="/berita"
        className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Kembali ke Berita & Kegiatan
      </Link>

      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-slate-800 dark:ring-slate-700 md:p-10">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
          Kegiatan Karang Taruna
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          Pengajian Safari Pemuda-Pemudi
        </h1>

        <div className="mt-8 space-y-5 text-base leading-7 text-gray-600 dark:text-slate-300">
          <p>
            Pengajian Safari Pemuda-Pemudi merupakan kegiatan keagamaan dan
            silaturahmi yang diikuti oleh pemuda-pemudi Karang Taruna RT 02.
            Kegiatan ini menjadi ruang untuk berkumpul, belajar, dan memperkuat
            hubungan antaranggota dalam suasana yang positif.
          </p>
          <p>
            Melalui pengajian bersama, peserta diajak memperdalam pemahaman
            keagamaan serta menerapkan nilai-nilai kebaikan, kepedulian, dan
            kebersamaan dalam kehidupan sehari-hari. Kegiatan ini juga mendorong
            generasi muda agar aktif membangun lingkungan yang rukun dan saling
            mendukung.
          </p>
          <p>
            Selain sebagai sarana menambah wawasan, pertemuan ini mempererat
            silaturahmi antara pemuda-pemudi dan membuka kesempatan untuk
            bertukar gagasan mengenai kegiatan positif bagi lingkungan.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-100 pt-6 dark:border-slate-700">
          <Link
            to="/galeri"
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Lihat dokumentasi foto
          </Link>
          <Link
            to="/agenda"
            className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Kembali ke agenda
          </Link>
        </div>
      </div>
    </article>
  );
}
