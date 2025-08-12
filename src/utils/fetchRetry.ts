export async function fetchWithRetry(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: { retries?: number; backoffMs?: number } = {}
): Promise<Response> {
  const { retries = 2, backoffMs = 300 } = options
  let attempt = 0
  let lastError: unknown = null

  while (attempt <= retries) {
    try {
      const res = await fetch(input, init)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res
    } catch (err) {
      lastError = err
      if (attempt === retries) break
      await new Promise(r => setTimeout(r, backoffMs * Math.pow(2, attempt)))
    }
    attempt += 1
  }
  throw lastError instanceof Error ? lastError : new Error('fetchWithRetry failed')
}


