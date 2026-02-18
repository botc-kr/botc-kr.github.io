import { useCallback } from 'react'
import { fetchGameLogs } from '@/features/tracker/api'
import type { GameLog } from '@/features/tracker/types'
import { useAsyncData } from '@/hooks/useAsyncData'

interface UseGameLogsReturn {
  gameLogs: GameLog[]
  isLoading: boolean
}

export const useGameLogs = (): UseGameLogsReturn => {
  const loadGameLogs = useCallback(fetchGameLogs, [])
  const { data: gameLogs, isLoading } = useAsyncData<GameLog[]>(loadGameLogs, [])

  return { gameLogs, isLoading }
}
