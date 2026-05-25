import { getToken } from "@/lib/auth";

export const API_BASE = "/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

function resolvePath(path: string): string {
  if (path.startsWith("/api/")) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

export async function api<T>(path: string, options?: ApiOptions): Promise<T> {
  const { body, auth = true, headers: initHeaders, ...rest } = options ?? {};
  const headers = new Headers(initHeaders);
  headers.set("Content-Type", "application/json");

  if (auth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(resolvePath(path), {
    ...rest,
    headers,
    body:
      body === undefined
        ? undefined
        : typeof body === "string"
          ? body
          : JSON.stringify(body),
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errorBody = (await response.json()) as {
        message?: string | string[];
      };
      if (typeof errorBody.message === "string") {
        message = errorBody.message;
      } else if (Array.isArray(errorBody.message)) {
        message = errorBody.message.join(", ");
      }
    } catch {
      // mantém statusText
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
