// Cliente HTTP único. Si CUALQUIER petición (menos el login) recibe 401,
// avisa a la app con un evento para que redirija al login.
export const UNAUTHORIZED_EVENT = 'unauthorized';

export async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    credentials: 'include', // envía la cookie de sesión
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && path !== '/login') {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }
  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }
  return data;
}
