export type ApiEnvelope<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  id?: number;
  details?: unknown;
};

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<ApiEnvelope<T>> {
  const headers: Record<string, string> = { ...(init?.headers as Record<string, string>) };
  let body: BodyInit | undefined = init?.body as BodyInit | undefined;
  if (init && 'json' in init && init.json !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(init.json);
  }

  const res = await fetch(path, {
    ...init,
    credentials: 'include',
    headers,
    body,
  });

  const raw = await res.text();
  let json: ApiEnvelope<T> = {};
  try {
    json = raw ? (JSON.parse(raw) as ApiEnvelope<T>) : {};
  } catch {
    json = { message: raw || res.statusText };
  }

  if (!res.ok) {
    const msg = typeof json.message === 'string' ? json.message : res.statusText;
    throw Object.assign(new Error(msg), { status: res.status, details: json.details });
  }
  if (json.success === false) {
    const msg = typeof json.message === 'string' ? json.message : 'Error en la solicitud';
    throw Object.assign(new Error(msg), { details: json.details });
  }
  return json;
}

export async function apiFetchData<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const env = await apiFetch<T>(path, init);
  return env.data as T;
}
