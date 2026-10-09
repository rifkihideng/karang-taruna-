import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@libsql/client';
import { berita, kegiatan, anggota, galeri } from './data/seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

// Turso (libSQL) database. Jika TURSO_DATABASE_URL tidak diisi, otomatis
// memakai database SQLite lokal di `data/karang-taruna.db` untuk development.
function resolveUrl() {
  if (tursoUrl) return tursoUrl;

  const dbPath = path.join(__dirname, '..', 'data', 'karang-taruna.db');
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  return `file:${dbPath}`;
}

export const db = tursoToken
  ? createClient({ url: resolveUrl(), authToken: tursoToken })
  : createClient({ url: resolveUrl() });

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
    status TEXT DEFAULT 'pending'
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
}

export async function initDb() {
  for (const statement of DDL) {
    await db.execute(statement);
  }
  await seedIfEmpty();
}
