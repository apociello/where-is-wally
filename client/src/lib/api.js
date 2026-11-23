const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, { body, ...options } = {}) {
  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error("Can't reach the server. Please try again later.");
  }

  // null if the response isn't JSON (e.g. an error page from the hosting)
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? 'Something went wrong');
  }

  return data;
}
