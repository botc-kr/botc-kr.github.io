import { useCallback, useEffect, useRef, useState } from 'react'
import { isAbortError } from '@/utils/errors'

const DEFAULT_ERROR_MESSAGE = '데이터를 불러오는데 실패했습니다'

interface UseAsyncDataOptions {
  getErrorMessage?: (error: unknown) => string
  onError?: (error: unknown) => void
}

type AsyncDataLoader<T> = (signal?: AbortSignal) => Promise<T>

export const useAsyncData = <T>(
  loadData: AsyncDataLoader<T>,
  initialData: T,
  options: UseAsyncDataOptions = {},
) => {
  const { getErrorMessage, onError } = options
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestVersionRef = useRef(0)
  const activeAbortControllerRef = useRef<AbortController | null>(null)

  const abortActiveRequest = useCallback((): void => {
    activeAbortControllerRef.current?.abort()
    activeAbortControllerRef.current = null
  }, [])

  const reload = useCallback(async () => {
    const requestVersion = requestVersionRef.current + 1
    requestVersionRef.current = requestVersion
    abortActiveRequest()

    const abortController = new AbortController()
    activeAbortControllerRef.current = abortController
    setIsLoading(true)
    setError(null)

    try {
      const nextData = await loadData(abortController.signal)

      if (requestVersion !== requestVersionRef.current || abortController.signal.aborted) {
        return
      }

      setData(nextData)
    } catch (error) {
      if (requestVersion !== requestVersionRef.current || abortController.signal.aborted || isAbortError(error)) {
        return
      }

      onError?.(error)
      setError(getErrorMessage?.(error) ?? (error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE))
    } finally {
      if (requestVersion === requestVersionRef.current && !abortController.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [abortActiveRequest, getErrorMessage, loadData, onError])

  useEffect(() => {
    void reload()

    return () => {
      requestVersionRef.current += 1
      abortActiveRequest()
    }
  }, [abortActiveRequest, reload])

  return { data, isLoading, error, reload }
}
