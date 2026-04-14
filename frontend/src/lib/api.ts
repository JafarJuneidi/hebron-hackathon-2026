import type { ApiResponse } from "@shared/types"

let getToken: (() => Promise<string | null>) | null = null

export function setTokenGetter(fn: () => Promise<string | null>) {
  getToken = fn
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  }

  if (getToken) {
    const token = await getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  const res = await fetch(path, { ...options, headers })
  const json = (await res.json()) as ApiResponse<T>

  if (json.error) {
    throw new Error(json.error)
  }

  return json.data as T
}

export const api = {
  get<T>(path: string) {
    return request<T>(path)
  },
  post<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    })
  },
  delete<T>(path: string) {
    return request<T>(path, { method: "DELETE" })
  },
}
