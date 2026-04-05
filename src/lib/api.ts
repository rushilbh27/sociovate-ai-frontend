const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.sociovate.com"

interface FetchOptions {
  method?: string
  body?: unknown
  apiKey?: string | null
}

export async function apiFetch<T = unknown>(
  path: string,
  opts: FetchOptions = {}
): Promise<T> {
  const { method = "GET", body, apiKey } = opts

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (apiKey) {
    headers["X-API-Key"] = apiKey
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text}`)
  }

  return res.json()
}
