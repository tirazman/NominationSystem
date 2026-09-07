const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

function getToken(): string | null {
  return localStorage.getItem("election_token");
}

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const finalHeaders: HeadersInit = {
    ...(rest.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...headers,
  };

  if (auth) {
    const token = getToken();
    if (token) {
      (finalHeaders as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers: finalHeaders });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    const message =
      (body && (body.error?.formErrors?.join(", ") || body.error)) || `Request failed (${res.status})`;
    throw new ApiError(typeof message === "string" ? message : JSON.stringify(message), res.status, body);
  }

  return body as T;
}

export const api = {
  get: <T>(path: string, auth = true) => request<T>(path, { method: "GET", auth }),
  post: <T>(path: string, data: unknown, auth = true) =>
    request<T>(path, {
      method: "POST",
      auth,
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  patch: <T>(path: string, data: unknown, auth = true) =>
    request<T>(path, { method: "PATCH", auth, body: JSON.stringify(data) }),
};

export { API_BASE, getToken };

/** Photo URLs are absolute (Vercel Blob) in production; this stays safe if a relative path ever shows up. */
export function resolvePhotoUrl(photoUrl: string): string {
  return /^https?:\/\//.test(photoUrl) ? photoUrl : `${API_BASE}${photoUrl}`;
}
