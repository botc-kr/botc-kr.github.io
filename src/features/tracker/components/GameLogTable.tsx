import { Fragment, type FC } from 'react'
import type { GameLog, Player } from '@/features/tracker/types'
import WinnerBadge from '@/features/tracker/components/WinnerBadge'

interface GameLogTableProps {
  logs: GameLog[]
  expandedGameId: string | null
  onToggleGameDetail: (gameId: string) => void
}

const playerCardKey = (logId: string, player: Player): string => `${logId}-${player.id}-${player.role}`

const GameLogTable: FC<GameLogTableProps> = ({ logs, expandedGameId, onToggleGameDetail }) => (
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
            <Fragment key={log.id}>
              <tr
                className={`bg-white border-b hover:bg-gray-50 cursor-pointer ${expandedGameId === log.id ? 'bg-gray-50' : ''}`}
                onClick={() => onToggleGameDetail(log.id)}>
                <td className="px-6 py-4 font-medium text-gray-900">{log.date}</td>
                <td className="px-6 py-4">{log.edition.name}</td>
                <td className="px-6 py-4">
                  <WinnerBadge winner={log.winner} />
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-blue-600 hover:text-blue-800">{expandedGameId === log.id ? 'Close' : 'View Players'}</span>
                </td>
              </tr>

              {expandedGameId === log.id ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {log.players.map(player => (
                        <div
                          key={playerCardKey(log.id, player)}
                          className={`p-3 rounded-lg border flex items-center gap-3 ${
                            player.isDead ? 'bg-gray-100 border-gray-200 opacity-70 grayscale' : 'bg-white border-gray-200 shadow-xs'
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
                              {player.isDead ? <span className="text-red-500 font-bold ml-1">(Dead)</span> : null}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ) : null}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default GameLogTable
