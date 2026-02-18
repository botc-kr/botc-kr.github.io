import { useCallback } from 'react'
import { fetchHelperScriptEntries } from '@/features/helper/services/helperScriptService'
import type { HelperEntry } from '@/features/helper/types'
import { useAsyncData } from '@/hooks/useAsyncData'

interface UseHelperEntriesReturn {
  entries: HelperEntry[]
  isLoading: boolean
  loadError: string | null
}

export const useHelperEntries = (scriptUrl: string): UseHelperEntriesReturn => {
  const loadSelectedScriptEntries = useCallback(async (signal?: AbortSignal): Promise<HelperEntry[]> => {
    return fetchHelperScriptEntries(scriptUrl, signal)
  }, [scriptUrl])

  const getLoadErrorMessage = useCallback(
    (error: unknown): string => (error instanceof Error ? error.message : '스크립트를 불러오는데 실패했습니다'),
    [],
  )

  const { data: entries, isLoading, error: loadError } = useAsyncData<HelperEntry[]>(loadSelectedScriptEntries, [], {
    getErrorMessage: getLoadErrorMessage,
  })

  return { entries, isLoading, loadError }
}
