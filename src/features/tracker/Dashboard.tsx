import { type FC, useState } from 'react'
import ChartsPanel from '@/features/tracker/components/ChartsPanel'
import GameLogTable from '@/features/tracker/components/GameLogTable'
import StatsSummary from '@/features/tracker/components/StatsSummary'
import { useDashboardMetrics } from '@/features/tracker/hooks/useDashboardMetrics'
import type { GameLog } from '@/features/tracker/types'

interface DashboardProps {
  logs: GameLog[]
}

const Dashboard: FC<DashboardProps> = ({ logs }) => {
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null)
  const { hasLogs, totalGames, goodWins, evilWins, winRateData, recentGameWinners } = useDashboardMetrics(logs)

  const toggleGameDetail = (gameId: string): void => {
    setExpandedGameId(currentGameId => (currentGameId === gameId ? null : gameId))
  }

  return (
    <div className="space-y-8">
      <ChartsPanel hasLogs={hasLogs} winRateData={winRateData} recentGameWinners={recentGameWinners} />
      <StatsSummary totalGames={totalGames} goodWins={goodWins} evilWins={evilWins} />
      <GameLogTable logs={logs} expandedGameId={expandedGameId} onToggleGameDetail={toggleGameDetail} />
    </div>
  )
}

export default Dashboard
