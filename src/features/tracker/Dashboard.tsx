import React, { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Alignment, GameLog, Player } from '@/features/tracker/types'

interface DashboardProps {
  logs: GameLog[]
}

const WINNER_COLORS = {
  good: '#0088FE',
  evil: '#FF8042',
} as const

const WINNER_BADGE_CLASSES = {
  good: 'bg-blue-100 text-blue-800',
  evil: 'bg-orange-100 text-orange-800',
} as const

const winnerLabel = (winner: Alignment): string => winner.toUpperCase()

const playerCardKey = (logId: string, player: Player): string => `${logId}-${player.id}-${player.role}`

const EmptyChartState = () => <div className="h-full flex items-center justify-center text-gray-400">No data</div>

const StatCard = ({ label, value, valueClassName }: { label: string; value: number; valueClassName: string }) => (
  <div className="text-center">
    <span className={`block text-4xl font-bold ${valueClassName}`}>{value}</span>
    <span className="text-sm text-gray-500">{label}</span>
  </div>
)

const WinnerBadge = ({ winner }: { winner: Alignment }) => (
  <span className={`px-2 py-1 rounded-sm text-xs font-semibold ${WINNER_BADGE_CLASSES[winner]}`}>
    {winnerLabel(winner)}
  </span>
)

const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Win Rate</h3>
          <div className="h-64 flex-1">
            {hasLogs ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={winRateData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label>
                    <Cell key="cell-good" fill={WINNER_COLORS.good} />
                    <Cell key="cell-evil" fill={WINNER_COLORS.evil} />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartState />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Games (Winner)</h3>
          <div className="h-64 flex-1">
            {hasLogs ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recentGameWinners}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={({
                      payload,
                      label,
                    }: {
                      payload?: ReadonlyArray<{ payload: { winner: 'good' | 'evil' } }>
                      label?: string | number
                    }) => {
                      if (!payload?.length) {
                        return null
                      }

                      const winner = payload[0].payload.winner
                      return (
                        <div className="bg-white p-2 border shadow-xs rounded-sm">
                          <p className="font-bold">{label}</p>
                          <p style={{ color: WINNER_COLORS[winner] }}>Winner: {winnerLabel(winner)}</p>
                        </div>
                      )
                    }}
                  />
                  <Bar dataKey="value" name="Game">
                    {recentGameWinners.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={WINNER_COLORS[entry.winner]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartState />
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100 flex justify-around">
        <StatCard label="Total Games" value={logs.length} valueClassName="text-gray-900" />
        <StatCard label="Good Wins" value={goodWins} valueClassName="text-blue-500" />
        <StatCard label="Evil Wins" value={evilWins} valueClassName="text-orange-500" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Games Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Edition</th>
                <th className="px-6 py-3">Winner</th>
                <th className="px-6 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <React.Fragment key={log.id}>
                  <tr
                    className={`bg-white border-b hover:bg-gray-50 cursor-pointer ${expandedGameId === log.id ? 'bg-gray-50' : ''}`}
                    onClick={() => toggleGameDetail(log.id)}>
                    <td className="px-6 py-4 font-medium text-gray-900">{log.date}</td>
                    <td className="px-6 py-4">{log.edition.name}</td>
                    <td className="px-6 py-4">
                      <WinnerBadge winner={log.winner} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-blue-600 hover:text-blue-800">
                        {expandedGameId === log.id ? 'Close' : 'View Players'}
                      </span>
                    </td>
                  </tr>

                  {expandedGameId === log.id && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {log.players.map(player => (
                            <div
                              key={playerCardKey(log.id, player)}
                              className={`p-3 rounded-lg border flex items-center gap-3 ${
                                player.isDead
                                  ? 'bg-gray-100 border-gray-200 opacity-70 grayscale'
                                  : 'bg-white border-gray-200 shadow-xs'
                              }`}>
                              <div className="w-10 h-10 flex-shrink-0 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                                {player.roleImage ? (
                                  <img src={player.roleImage} alt={player.roleName} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xs text-gray-500">?</span>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{player.name}</p>
                                <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                                  {player.roleName}
                                  {player.isDead && <span className="text-red-500 font-bold ml-1">(Dead)</span>}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
