import type { FC } from 'react'
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Alignment, RecentGameWinnerData, WinRateDataItem } from '@/features/tracker/types'
import { WINNER_COLORS, winnerLabel } from '@/features/tracker/constants'

interface ChartsPanelProps {
  hasLogs: boolean
  winRateData: WinRateDataItem[]
  recentGameWinners: RecentGameWinnerData[]
}

interface WinnerTooltipProps {
  label?: string | number
  payload?: ReadonlyArray<{ payload: { winner: Alignment } }>
}

const EmptyChartState: FC = () => <div className="h-full flex items-center justify-center text-gray-400">No data</div>

const WinnerTooltip: FC<WinnerTooltipProps> = ({ label, payload }) => {
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
}

const ChartsPanel: FC<ChartsPanelProps> = ({ hasLogs, winRateData, recentGameWinners }) => (
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
              <Tooltip cursor={{ fill: 'transparent' }} content={<WinnerTooltip />} />
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
)

export default ChartsPanel
