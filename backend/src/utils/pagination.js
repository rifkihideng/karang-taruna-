// Helper untuk membaca & memvalidasi parameter pagination (?limit= & ?offset=)
// dari query string. Mengembalikan null jika keduanya tidak disediakan
// (berarti ambil semua data, untuk menjaga kompatibilitas dengan frontend).

const DEFAULT_MAX_LIMIT = 200;

export function getPagination(req) {
  const rawLimit = req.query.limit;
  const rawOffset = req.query.offset;

  if (rawLimit === undefined && rawOffset === undefined) {
    return null;
  }

  let limit = rawLimit !== undefined ? Number(rawLimit) : DEFAULT_MAX_LIMIT;
  let offset = rawOffset !== undefined ? Number(rawOffset) : 0;

  if (!Number.isInteger(limit) || limit < 1) limit = DEFAULT_MAX_LIMIT;
  if (!Number.isInteger(offset) || offset < 0) offset = 0;
  if (limit > DEFAULT_MAX_LIMIT) limit = DEFAULT_MAX_LIMIT;

  return { limit, offset };
}
