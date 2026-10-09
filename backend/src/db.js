import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import { berita, kegiatan, anggota, galeri } from './data/seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim();
const hasRemoteTursoConfig = Boolean(
  tursoUrl &&
    tursoUrl.startsWith('libsql://') &&
    tursoUrl !== 'libsql://example.db' &&
    tursoToken &&
    tursoToken !== '******'
);

// Turso (libSQL) database. Jika konfigurasi remote kosong atau placeholder,
// otomatis memakai database SQLite lokal di `data/karang-taruna.db` untuk development.
function localDbPath() {
  const dbPath = path.join(__dirname, '..', 'data', 'karang-taruna.db');
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  return dbPath;
}

function createRemoteClient() {
  return createClient({ url: tursoUrl, authToken: tursoToken });
}

function createLocalClient() {
  return createClient({ url: `file:${localDbPath()}` });
}

export let db = hasRemoteTursoConfig ? createRemoteClient() : createLocalClient();

const DDL = [
  `CREATE TABLE IF NOT EXISTS berita (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    judul TEXT NOT NULL,
    kategori TEXT NOT NULL,
    tanggal TEXT NOT NULL,
    ringkasan TEXT NOT NULL,
    isi TEXT NOT NULL,
    gambar TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS kegiatan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    tanggal TEXT NOT NULL,
    waktu TEXT,
    tempat TEXT,
    status TEXT DEFAULT 'terjadwal'
  )`,
  `CREATE TABLE IF NOT EXISTS anggota (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    jabatan TEXT,
    angkatan TEXT,
    alamat TEXT,
    kontak TEXT,
    minat TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS galeri (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    judul TEXT NOT NULL,
    url TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS kontak (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    email TEXT NOT NULL,
    pesan TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
];

const SEED = [
  {
    table: 'berita',
    rows: berita,
    columns: ['judul', 'kategori', 'tanggal', 'ringkasan', 'isi', 'gambar'],
  },
  {
    table: 'kegiatan',
    rows: kegiatan,
    columns: ['nama', 'tanggal', 'waktu', 'tempat', 'status'],
  },
  {
    table: 'anggota',
    rows: anggota,
    columns: ['nama', 'jabatan', 'angkatan'],
  },
  {
    table: 'galeri',
    rows: galeri,
    columns: ['judul', 'url'],
  },
];

async function seedIfEmpty() {
  for (const { table, rows, columns } of SEED) {
    const { rows: [{ c }] } = await db.execute(`SELECT COUNT(*) AS c FROM ${table}`);
    if (Number(c) > 0) continue;

    const placeholders = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    for (const row of rows) {
      await db.execute(sql, columns.map((col) => row[col]));
    }
  }

  // Add new gallery entries to databases that already contain older photos.
  for (const photo of galeri) {
    const { rows } = await db.execute('SELECT id FROM galeri WHERE url = ? LIMIT 1', [photo.url]);
    if (rows.length > 0) {
      await db.execute('UPDATE galeri SET judul = ? WHERE id = ?', [photo.judul, rows[0].id]);
      continue;
    }
    await db.execute('INSERT INTO galeri (judul, url) VALUES (?, ?)', [photo.judul, photo.url]);
  }

  // Pastikan ada admin user — untuk development. Password di-hash dengan bcrypt.
  const { rows: adminCountRow } = await db.execute(`SELECT COUNT(*) AS c FROM admin_users`);
  if (Number(adminCountRow[0].c) === 0) {
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
    const SALT_ROUNDS = Number(process.env.ADMIN_SALT_ROUNDS || 10);
    const PEPPER = process.env.ADMIN_PEPPER || '';
    const passwordToHash = ADMIN_PASSWORD + PEPPER;
    const hash = bcrypt.hashSync(passwordToHash, SALT_ROUNDS);
    await db.execute(`INSERT INTO admin_users (username, password_hash) VALUES (?, ?)`, ['admin', hash]);
    console.log('Admin user seeded (username: admin)');
  }
}

export async function initDb() {
  // Jika Turso remote tidak terjangkau saat server mulai, otomatis beralih
  // ke database SQLite lokal supaya website tetap bisa berjalan.
  if (hasRemoteTursoConfig) {
    try {
      await db.execute('SELECT 1');
      console.log('✅ Terhubung ke database Turso');
    } catch (err) {
      console.warn(`⚠️ Turso tidak terjangkau (${err.message || err}). Menggunakan SQLite lokal.`);
      db = createLocalClient();
    }
  }

  for (const statement of DDL) {
    await db.execute(statement);
  }
  const { rows: anggotaColumns } = await db.execute('PRAGMA table_info(anggota)');
  if (!anggotaColumns.some((column) => column.name === 'created_at')) {
    await db.execute('ALTER TABLE anggota ADD COLUMN created_at TEXT');
  }
  await seedIfEmpty();
}
