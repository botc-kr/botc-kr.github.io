import { type GameLog } from '@/features/tracker/types'
import {
  type RawLogModule,
  buildRoleMetadata,
  enrichPlayersWithRoleMetadata,
  getLogFileNameFromPath,
  parseDateFromFilename,
  resolveRawLog,
  resolveWinner,
} from '@/features/tracker/services/logParserService'

const rawLogModulesByPath = import.meta.glob<RawLogModule>('../../logs/*.json', { eager: true })

const sortLogsByIdDesc = (logs: GameLog[]): GameLog[] =>
  [...logs].sort((leftLog, rightLog) => rightLog.id.localeCompare(leftLog.id))

export const fetchGameLogs = async (): Promise<GameLog[]> => {
  try {
    const gameLogs = Object.entries(rawLogModulesByPath).map(([path, moduleValue]) => {
      const rawLog = resolveRawLog(moduleValue)
      const fileName = getLogFileNameFromPath(path)
      const date = parseDateFromFilename(fileName)
      const { roleMetadataById, demonRoleIds } = buildRoleMetadata(rawLog.roles)
      const enhancedPlayers = enrichPlayersWithRoleMetadata(rawLog.players, roleMetadataById)

      return {
        ...rawLog,
        players: enhancedPlayers,
        id: fileName,
        date,
        winner: resolveWinner(fileName, enhancedPlayers, demonRoleIds),
      }
    })

    return sortLogsByIdDesc(gameLogs)
  } catch (error) {
    console.error('Error loading local logs', error)
    return []
  }
}
