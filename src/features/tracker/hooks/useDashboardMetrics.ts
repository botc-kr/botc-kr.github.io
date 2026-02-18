import { useMemo } from 'react'
import type { Alignment, GameLog } from '@/features/tracker/types'

interface WinRateDataItem {
  name: string
  value: number
}

interface RecentGameWinnerData {
  name: string
  value: number
  winner: Alignment
}

interface UseDashboardMetricsReturn {
  hasLogs: boolean
  totalGames: number
  goodWins: number
  evilWins: number
  winRateData: WinRateDataItem[]
  recentGameWinners: RecentGameWinnerData[]
}

export const useDashboardMetrics = (logs: GameLog[]): UseDashboardMetricsReturn => {
  const { goodWins, evilWins, winRateData } = useMemo(() => {
    const totals = logs.reduce(
      (accumulator, log) => {
        if (log.winner === 'good') {
          accumulator.good += 1
        } else {
          accumulator.evil += 1
        }

        return accumulator
      },
      { good: 0, evil: 0 },
    )

    return {
      goodWins: totals.good,
      evilWins: totals.evil,
      winRateData: [
        { name: 'Good', value: totals.good },
        { name: 'Evil', value: totals.evil },
      ],
    }
  }, [logs])

  const recentGameWinners = useMemo(
    () =>
      logs
        .slice(0, 10)
        .map(log => ({
          name: log.date.slice(5),
          value: 1,
          winner: log.winner,
        }))
        .reverse(),
    [logs],
  )

  return {
    hasLogs: logs.length > 0,
    totalGames: logs.length,
    goodWins,
    evilWins,
    winRateData,
    recentGameWinners,
  }
}
