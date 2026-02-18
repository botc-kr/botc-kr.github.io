import { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_ERROR_MESSAGE = '데이터를 불러오는데 실패했습니다'

interface UseAsyncDataOptions {
  getErrorMessage?: (error: unknown) => string
  onError?: (error: unknown) => void
}

export const useAsyncData = <T>(
  loadData: () => Promise<T>,
  initialData: T,
  options: UseAsyncDataOptions = {},
) => {
  const { getErrorMessage, onError } = options
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestVersionRef = useRef(0)

  const reload = useCallback(async () => {
    const requestVersion = requestVersionRef.current + 1
    requestVersionRef.current = requestVersion
    setIsLoading(true)
    setError(null)

    try {
      const nextData = await loadData()

      if (requestVersion !== requestVersionRef.current) {
        return
      }

      setData(nextData)
    } catch (error) {
      if (requestVersion !== requestVersionRef.current) {
        return
      }

      onError?.(error)
      setError(getErrorMessage?.(error) ?? (error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE))
    } finally {
      if (requestVersion === requestVersionRef.current) {
        setIsLoading(false)
      }
    }
  }, [getErrorMessage, loadData, onError])

  useEffect(() => {
    void reload()

    return () => {
      requestVersionRef.current += 1
    }
  }, [reload])

  return { data, isLoading, error, reload }
}
