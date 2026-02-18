import { useCallback } from 'react'
import { fetchGameLogs } from '@/features/tracker/api'
import type { GameLog } from '@/features/tracker/types'
import { useAsyncData } from '@/hooks/useAsyncData'

const sortLogsByIdDesc = (logs: GameLog[]): GameLog[] =>
  [...logs].sort((leftLog, rightLog) => rightLog.id.localeCompare(leftLog.id))

interface UseGameLogsReturn {
  gameLogs: GameLog[]
  isLoading: boolean
}

export const useGameLogs = (): UseGameLogsReturn => {
  const loadGameLogs = useCallback(async (): Promise<GameLog[]> => sortLogsByIdDesc(await fetchGameLogs()), [])
  const { data: gameLogs, isLoading } = useAsyncData<GameLog[]>(loadGameLogs, [])

  return { gameLogs, isLoading }
}
