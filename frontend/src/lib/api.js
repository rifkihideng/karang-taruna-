const BASE = '/api';

function requestHeaders(headers = {}) {
  const token = localStorage.getItem('adminToken');
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: requestHeaders(options.headers),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(json.error || `Permintaan gagal (status ${res.status})`);
    error.status = res.status;
    throw error;
  }
  return json;
}

export async function fetchData(path) {
  const json = await request(path);
  return json.data;
}

export async function postData(path, body) {
  return request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function putData(path, body) {
  return request(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function deleteData(path) {
  return request(path, { method: 'DELETE' });
}

export async function postFormData(path, formData) {
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(json.error || `Permintaan gagal (status ${res.status})`);
    error.status = res.status;
    throw error;
  }
  return json;
}
