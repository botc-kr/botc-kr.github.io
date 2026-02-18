import type { FC } from 'react'

interface StatsSummaryProps {
  totalGames: number
  goodWins: number
  evilWins: number
}

interface StatCardProps {
  label: string
  value: number
  valueClassName: string
}

const StatCard: FC<StatCardProps> = ({ label, value, valueClassName }) => (
  <div className="text-center">
    <span className={`block text-4xl font-bold ${valueClassName}`}>{value}</span>
    <span className="text-sm text-gray-500">{label}</span>
  </div>
)

const StatsSummary: FC<StatsSummaryProps> = ({ totalGames, goodWins, evilWins }) => (
  <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100 flex justify-around">
    <StatCard label="Total Games" value={totalGames} valueClassName="text-gray-900" />
    <StatCard label="Good Wins" value={goodWins} valueClassName="text-blue-500" />
    <StatCard label="Evil Wins" value={evilWins} valueClassName="text-orange-500" />
  </div>
)

export default StatsSummary
