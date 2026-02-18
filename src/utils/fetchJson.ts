import { fetchWithRetry } from '@/utils/fetchRetry'

export const fetchJsonWithRetry = async <T>(url: string): Promise<T> => {
  const response = await fetchWithRetry(url)
  return (await response.json()) as T
}
