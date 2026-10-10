import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Reveal from '../components/Reveal';

const faqs = [
  {
    tanya: 'Apa itu Karang Taruna RT 02?',
    jawab:
      'Karang Taruna RT 02 adalah organisasi kepemudaan di lingkungan RT 02/RW 012 yang mewadahi kegiatan sosial, keagamaan, dan pengembangan potensi generasi muda di lingkungan sekitar.',
  },
  {
    tanya: 'Siapa saja yang bisa bergabung?',
    jawab:
      'Seluruh pemuda dan pemudi yang berdomisili di lingkungan RT 02/RW 012 dapat bergabung, tanpa memandang latar belakang pendidikan maupun pekerjaan.',
  },
  {
    tanya: 'Bagaimana cara mendaftar menjadi anggota?',
    jawab:
      'Kamu bisa mengisi formulir pendaftaran pada halaman Daftar. Setelah terkirim, pengurus akan menghubungi kamu untuk langkah selanjutnya.',
  },
  {
    tanya: 'Kegiatan apa saja yang diadakan?',
    jawab:
      'Kami rutin mengadakan kegiatan seperti pengajian safari, kerja bakti, peringatan hari besar, kegiatan olahraga, dan kegiatan sosial kemasyarakatan lainnya. Jadwal lengkapnya bisa dilihat di halaman Agenda.',
  },
  {
    tanya: 'Apakah ada iuran keanggotaan?',
    jawab:
      'Iuran bersifat sukarela dan disesuaikan dengan kesepakatan bersama. Dana yang terkumpul digunakan untuk mendukung kegiatan dan operasional organisasi.',
  },
  {
    tanya: 'Di mana lokasi kegiatan berlangsung?',
    jawab:
      'Sebagian besar kegiatan berlangsung di Perumahan Taman Buah Sukamantri, RT 02/RW 012. Detail tempat setiap kegiatan tercantum pada halaman Agenda.',
  },
  {
    tanya: 'Bagaimana cara ikut berkontribusi?',
    jawab:
      'Kamu bisa ikut serta dalam kegiatan yang diadakan, menjadi panitia, atau memberikan ide dan masukan melalui pengurus. Partisipasi sekecil apa pun sangat berarti.',
  },
  {
    tanya: 'Di mana saya bisa melihat dokumentasi kegiatan?',
    jawab:
      'Foto-foto dokumentasi kegiatan bisa kamu lihat di halaman Galeri, dan berita terbaru tersedia di halaman Berita.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <HelpCircle size={26} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FAQ</h1>
            <p className="mt-1 text-gray-600 dark:text-slate-400">
              Pertanyaan yang sering diajukan seputar Karang Taruna RT 02.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-10 space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.tanya} delay={0.04 * i}>
              <div
                className={`overflow-hidden rounded-2xl bg-white shadow-sm ring-1 transition-all duration-300 dark:bg-slate-800 ${
                  isOpen
                    ? 'ring-blue-200 dark:ring-blue-500/40'
                    : 'ring-gray-100 hover:ring-blue-100 dark:ring-slate-700 dark:hover:ring-slate-600'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">{f.tanya}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-blue-600 transition-transform duration-300 dark:text-blue-400 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-gray-600 dark:text-slate-300">{f.jawab}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
