const BASE_URL = '';

function getXsrfToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
}

function buildHeaders(method: string, options: RequestInit): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const xsrf = getXsrfToken();
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) && xsrf) {
    headers['X-XSRF-TOKEN'] = xsrf;
  }
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase();

  let res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(method, options),
    credentials: 'include',
  });

  // The very first write of a session can 403 before the browser has picked up
  // the XSRF-TOKEN cookie (it's only issued lazily). That failed response still
  // plants a fresh cookie, so retry once transparently before surfacing an error.
  if (res.status === 403 && method !== 'GET') {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: buildHeaders(method, options),
      credentials: 'include',
    });
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((error as { message?: string }).message ?? 'Error de servidor');
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get:    <T>(path: string)                  => request<T>(path),
  post:   <T>(path: string, body: unknown)   => request<T>(path, { method: 'POST',   body: body != null ? JSON.stringify(body) : undefined }),
  put:    <T>(path: string, body: unknown)   => request<T>(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: <T>(path: string)                  => request<T>(path, { method: 'DELETE' }),
};
