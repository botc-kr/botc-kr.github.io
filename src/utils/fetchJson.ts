import { fetchWithRetry } from '@/utils/fetchRetry'

export const fetchJsonWithRetry = async <T>(url: string, init: RequestInit = {}): Promise<T> => {
  const response = await fetchWithRetry(url, init)
  return (await response.json()) as T
}
