const BASE = '/api';

export async function fetchData(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    throw new Error(`Gagal memuat data (status ${res.status})`);
  }
  const json = await res.json();
  return json.data;
}

export async function postData(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || `Gagal (status ${res.status})`);
  }
  return json;
}
