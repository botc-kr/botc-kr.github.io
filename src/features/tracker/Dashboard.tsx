import { type FC, useMemo, useState } from 'react'
import ChartsPanel from '@/features/tracker/components/ChartsPanel'
import GameLogTable from '@/features/tracker/components/GameLogTable'
import StatsSummary from '@/features/tracker/components/StatsSummary'
import type { GameLog } from '@/features/tracker/types'

interface DashboardProps {
  logs: GameLog[]
}

const Dashboard: FC<DashboardProps> = ({ logs }) => {
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null)

  const { goodWins, evilWins, winRateData } = useMemo(() => {
    const totals = logs.reduce(
      (acc, log) => {
        if (log.winner === 'good') {
          acc.good += 1
        } else {
          acc.evil += 1
        }
        return acc
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

  const hasLogs = logs.length > 0

  const toggleGameDetail = (gameId: string): void => {
    setExpandedGameId(currentGameId => (currentGameId === gameId ? null : gameId))
  }

  return (
    <div className="space-y-8">
      <ChartsPanel hasLogs={hasLogs} winRateData={winRateData} recentGameWinners={recentGameWinners} />
      <StatsSummary totalGames={logs.length} goodWins={goodWins} evilWins={evilWins} />
      <GameLogTable logs={logs} expandedGameId={expandedGameId} onToggleGameDetail={toggleGameDetail} />
    </div>
  )
}

export default Dashboard
