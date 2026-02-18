import { isAbortError, throwIfAborted } from '@/utils/errors'

class NonRetriableHttpError extends Error {
  constructor(status: number) {
    super(`HTTP ${status}`)
    this.name = 'NonRetriableHttpError'
  }
}

const isRetriableStatusCode = (status: number): boolean =>
  status === 408 || status === 425 || status === 429 || status >= 500

const wait = async (delayMs: number, signal?: AbortSignal): Promise<void> => {
  if (!signal) {
    await new Promise(resolve => setTimeout(resolve, delayMs))
    return
  }

  await new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      signal.removeEventListener('abort', handleAbort)
      resolve()
    }, delayMs)

    const handleAbort = (): void => {
      clearTimeout(timeoutId)
      signal.removeEventListener('abort', handleAbort)
      reject(new DOMException('The operation was aborted.', 'AbortError'))
    }

    signal.addEventListener('abort', handleAbort, { once: true })
  })
}

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: { retries?: number; backoffMs?: number } = {}
): Promise<Response> {
  const { retries = 2, backoffMs = 300 } = options
  const signal = init.signal ?? undefined
  let attempt = 0
  let lastError: unknown = null

  while (attempt <= retries) {
    try {
      throwIfAborted(signal)
      const res = await fetch(input, init)
      if (!res.ok) {
        if (!isRetriableStatusCode(res.status)) {
          throw new NonRetriableHttpError(res.status)
        }

        throw new Error(`HTTP ${res.status}`)
      }

      return res
    } catch (err) {
      if (isAbortError(err)) {
        throw err
      }

      if (err instanceof NonRetriableHttpError) {
        throw err
      }

      lastError = err
      if (attempt === retries) break
      await wait(backoffMs * Math.pow(2, attempt), signal)
    }
    attempt += 1
  }
  throw lastError instanceof Error ? lastError : new Error('fetchWithRetry failed')
}
