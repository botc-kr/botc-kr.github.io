import React, { useMemo, useState } from 'react'
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from 'recharts'
import { GameLog } from './types'

interface DashboardProps {
    logs: GameLog[]
}

const COLORS = {
    good: '#0088FE', // Blue
    evil: '#FF8042', // Orange
}

const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
    const [expandedGameId, setExpandedGameId] = useState<string | null>(null)

    const winRateData = useMemo(() => {
        let goodWins = 0
        let evilWins = 0
        logs.forEach(log => {
            if (log.winner === 'good') goodWins++
            else evilWins++
        })
        return [
            { name: 'Good', value: goodWins },
            { name: 'Evil', value: evilWins },
        ]
    }, [logs])

    const recentGamesData = useMemo(() => {
        return logs.slice(0, 10).map(log => ({
            name: log.date.slice(5),
            value: 1,
            winner: log.winner
        })).reverse()
    }, [logs])

    const toggleExpand = (id: string) => {
        if (expandedGameId === id) setExpandedGameId(null)
        else setExpandedGameId(id)
    }

    return (
        <div className="space-y-8">
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Win Rate</h3>
                    <div className="h-64 flex-1">
                        {logs.length > 0 ? (
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
                                        label
                                    >
                                        <Cell key="cell-good" fill={COLORS.good} />
                                        <Cell key="cell-evil" fill={COLORS.evil} />
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">No data</div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Games (Winner)</h3>
                    <div className="h-64 flex-1">
                        {logs.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={recentGamesData}>
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        content={({ payload, label }: {
                                            payload?: ReadonlyArray<{ payload: { winner: 'good' | 'evil' } }>
                                            label?: string | number
                                        }) => {
                                            if (payload && payload.length) {
                                                const data = payload[0].payload
                                                return (
                                                    <div className="bg-white p-2 border shadow-sm rounded">
                                                        <p className="font-bold">{label}</p>
                                                        <p style={{ color: data.winner === 'good' ? COLORS.good : COLORS.evil }}>
                                                            Winner: {data.winner.toUpperCase()}
                                                        </p>
                                                    </div>
                                                )
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="value" name="Game">
                                        {recentGamesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.winner === 'good' ? COLORS.good : COLORS.evil} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">No data</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-around">
                <div className="text-center">
                    <span className="block text-4xl font-bold text-gray-900">{logs.length}</span>
                    <span className="text-sm text-gray-500">Total Games</span>
                </div>
                <div className="text-center">
                    <span className="block text-4xl font-bold text-blue-500">{winRateData[0].value}</span>
                    <span className="text-sm text-gray-500">Good Wins</span>
                </div>
                <div className="text-center">
                    <span className="block text-4xl font-bold text-orange-500">{winRateData[1].value}</span>
                    <span className="text-sm text-gray-500">Evil Wins</span>
                </div>
            </div>

            {/* Game Logs List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
                            {logs.map((log) => (
                                <React.Fragment key={log.id}>
                                    <tr
                                        className={`bg-white border-b hover:bg-gray-50 cursor-pointer ${expandedGameId === log.id ? 'bg-gray-50' : ''}`}
                                        onClick={() => toggleExpand(log.id)}
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">{log.date}</td>
                                        <td className="px-6 py-4">{log.edition.name}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-semibold ${log.winner === 'good'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-orange-100 text-orange-800'
                                                    }`}
                                            >
                                                {log.winner.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-blue-600 hover:text-blue-800">
                                                {expandedGameId === log.id ? 'Close' : 'View Players'}
                                            </span>
                                        </td>
                                    </tr>

                                    {/* Expanded Detail Row */}
                                    {expandedGameId === log.id && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 bg-gray-50">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    {log.players.map((player, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`p-3 rounded-lg border flex items-center gap-3 ${player.isDead
                                                                    ? 'bg-gray-100 border-gray-200 opacity-70 grayscale'
                                                                    : 'bg-white border-gray-200 shadow-sm'
                                                                }`}
                                                        >
                                                            {/* Role Icon */}
                                                            <div className="w-10 h-10 flex-shrink-0 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                                                                {player.roleImage ? (
                                                                    <img
                                                                        src={player.roleImage}
                                                                        alt={player.roleName}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <span className="text-xs text-gray-500">?</span>
                                                                )}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="font-semibold text-gray-900 truncate">
                                                                    {player.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                                                                    {player.roleName}
                                                                    {player.isDead && (
                                                                        <span className="text-red-500 font-bold ml-1">(Dead)</span>
                                                                    )}
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
