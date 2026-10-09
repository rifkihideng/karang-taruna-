// Data contoh (seed). Nantinya data ini akan diganti dengan database
// (MySQL/PostgreSQL) melalui ORM seperti Prisma atau Sequelize.

export const berita = [
  {
    id: 1,
    judul: 'Kerja Bakti Bersama Warga RT 02',
    kategori: 'Kegiatan Sosial',
    tanggal: '2026-10-01',
    ringkasan:
      'Karang Taruna RT 02 mengadakan kerja bakti membersihkan selokan dan lingkungan sekitar.',
    isi: 'Kegiatan kerja bakti dilaksanakan pada Minggu pagi. Seluruh anggota Karang Taruna dan warga bergotong royong membersihkan selokan, memangkas rumput, dan menata taman. Kegiatan ini bertujuan menjaga kebersihan dan kekompakan warga.',
    gambar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 2,
    judul: 'Turnamen Futsal Antar RT Resmi Dibuka',
    kategori: 'Olahraga',
    tanggal: '2026-09-20',
    ringkasan:
      'Turnamen futsal antar RT yang diinisiasi Karang Taruna resmi dibuka dan diikuti 8 tim.',
    isi: 'Turnamen futsal antar RT kembali digelar. Pembukaan dilakukan oleh Ketua RW dan diikuti 8 tim dari berbagai RT. Turnamen berlangsung setiap akhir pekan selama satu bulan.',
    gambar: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 3,
    judul: 'Pelatihan Digital Marketing untuk Pemuda',
    kategori: 'Pendidikan',
    tanggal: '2026-09-10',
    ringkasan:
      'Karang Taruna mengadakan pelatihan digital marketing gratis untuk pemuda RT 02.',
    isi: 'Pelatihan digital marketing diikuti 30 pemuda. Materi meliputi pemasaran lewat media sosial, pembuatan konten, dan pengenalan marketplace. Pemateri berasal dari praktisi UMKM setempat.',
    gambar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop',
  },
];

export const kegiatan = [
  {
    id: 1,
    nama: 'Pengajian Safari',
    tanggal: '2026-10-17',
    waktu: '19:30',
    tempat: 'RT 01',
    status: 'terjadwal',
  },
];

export const anggota = [
  { id: 1, nama: 'Amar', jabatan: 'Ketua', angkatan: '2024' },
  { id: 2, nama: 'Ridan', jabatan: 'Wakil Ketua', angkatan: '2024' },
  { id: 3, nama: 'Raffa', jabatan: 'Sekretaris', angkatan: '2024' },
  { id: 4, nama: 'Dewi', jabatan: 'Bendahara', angkatan: '2024' },
  { id: 5, nama: 'Keysa', jabatan: 'PDD', angkatan: '2024' },
  { id: 6, nama: 'Kanza', jabatan: 'PDD', angkatan: '2024' },
  { id: 7, nama: 'Desta', jabatan: 'PDD', angkatan: '2024' },
  { id: 8, nama: 'Pingkan', jabatan: 'PDD', angkatan: '2024' },
  { id: 9, nama: 'Kevin', jabatan: 'PDD', angkatan: '2024' },
  { id: 10, nama: 'Oja', jabatan: 'PDD', angkatan: '2024' },
  { id: 11, nama: 'Ilham', jabatan: 'Humas', angkatan: '2024' },
  { id: 12, nama: 'Fadil', jabatan: 'Humas', angkatan: '2024' },
  { id: 13, nama: 'Sulton', jabatan: 'Rohani', angkatan: '2024' },
  { id: 14, nama: 'Haikal', jabatan: 'Rohani', angkatan: '2024' },
  { id: 15, nama: 'Rifki', jabatan: 'Rohani', angkatan: '2024' },
  { id: 16, nama: 'Oji', jabatan: 'Olahraga', angkatan: '2024' },
  { id: 17, nama: 'Bayu', jabatan: 'Anggota', angkatan: '2024' },
  { id: 18, nama: 'Sifa', jabatan: 'Anggota', angkatan: '2024' },
  { id: 19, nama: 'Rezki', jabatan: 'Anggota', angkatan: '2024' },
  { id: 20, nama: 'Lia', jabatan: 'Anggota', angkatan: '2024' },
  { id: 21, nama: 'Rama', jabatan: 'Sekretaris', angkatan: '2024' },
  { id: 22, nama: 'Rafi', jabatan: 'Humas', angkatan: '2024' },
  { id: 23, nama: 'Iwan', jabatan: 'Humas', angkatan: '2024' },
  { id: 24, nama: 'Tegar', jabatan: 'Humas', angkatan: '2024' },
  { id: 25, nama: 'Ali', jabatan: 'Rohani', angkatan: '2024' },
  { id: 26, nama: 'Faik', jabatan: 'Rohani', angkatan: '2024' },
  { id: 27, nama: 'Ibnu', jabatan: 'PDD', angkatan: '2024' },
  { id: 28, nama: 'Miko', jabatan: 'PDD', angkatan: '2024' },
  { id: 29, nama: 'Ipang', jabatan: 'PDD', angkatan: '2024' },
  { id: 30, nama: 'Icang', jabatan: 'Olahraga', angkatan: '2024' },
  { id: 31, nama: 'Kaspul', jabatan: 'Olahraga', angkatan: '2024' },
  { id: 32, nama: 'Lili', jabatan: 'Olahraga', angkatan: '2024' },
  { id: 33, nama: 'Lila', jabatan: 'Anggota', angkatan: '2024' },
  { id: 34, nama: 'Ahdan', jabatan: 'Anggota', angkatan: '2024' },
  { id: 35, nama: 'Arol', jabatan: 'Anggota', angkatan: '2024' },
];

export const galeri = [
  {
    id: 1,
    judul: 'Pengajian Safari Pemuda-Pemudi',
    url: '/dokumentasi/pengajian-safari-pemuda-pemudi.jpeg',
  },
  {
    id: 2,
    judul: 'Dokumentasi Pengajian Safari',
    url: '/dokumentasi/dokumentasi-pengajian-safari.jpeg',
  },
  {
    id: 3,
    judul: 'Kajian Safari Bulanan',
    url: '/dokumentasi/pengajian-safari.jpeg',
  },
  {
    id: 4,
    judul: 'Pengajian Safari Bersama',
    url: '/dokumentasi/pengajian-safari-bersama.jpeg',
  },
];
