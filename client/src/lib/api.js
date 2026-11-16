const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? 'Something went wrong');
  }

  return data;
}
