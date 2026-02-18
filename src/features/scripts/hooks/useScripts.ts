import { useCallback } from 'react'
import { fetchScripts } from '@/features/scripts/services/scriptService'
import type { Script } from '@/features/scripts/types'
import { useAsyncData } from '@/hooks/useAsyncData'
import { notify } from '@/lib/utils'

interface UseScriptsReturn {
  scripts: Script[]
  isLoading: boolean
}

export const useScripts = (): UseScriptsReturn => {
  const handleLoadScriptsError = useCallback((error: unknown): void => {
    console.error('Error loading scripts:', error)
    notify('스크립트 데이터를 불러오지 못했습니다.')
  }, [])

  const { data: scripts, isLoading } = useAsyncData<Script[]>(fetchScripts, [], {
    onError: handleLoadScriptsError,
  })

  return { scripts, isLoading }
}
