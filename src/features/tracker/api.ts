import { Alignment, GameLog, RawGameLog, RoleDefinition, Team } from '@/features/tracker/types'
import { getRoleIconUrl } from '@/utils/roleIcon'

type RawLogModule = RawGameLog | { default: RawGameLog }
type RoleMetadata = { name: string; image: string; team?: Team }

const rawLogModulesByPath = import.meta.glob<RawLogModule>('../../logs/*.json', { eager: true })

const readRoleField = (
  role: RoleDefinition,
  key: 'id' | 'name' | 'team',
  legacyKey: '0' | '1' | '12',
): string | undefined => {
  const value = role[key] ?? role[legacyKey]
  return typeof value === 'string' ? value : undefined
}

const resolveRawLog = (moduleValue: RawLogModule): RawGameLog =>
  'default' in moduleValue ? moduleValue.default : moduleValue

const buildRoleMetadata = (roles: RoleDefinition[] = []) => {
  const roleMetadataById = new Map<string, RoleMetadata>()
  const demonRoleIds = new Set<string>()

  for (const role of roles) {
    const roleId = readRoleField(role, 'id', '0')
    if (!roleId) {
      continue
    }

    const roleName = readRoleField(role, 'name', '1') ?? roleId
    const roleTeam = readRoleField(role, 'team', '12') as Team | undefined
    const iconUrl = getRoleIconUrl(roleId) ?? ''

    roleMetadataById.set(roleId, { name: roleName, image: iconUrl, team: roleTeam })

    if (roleTeam === 'demon') {
      demonRoleIds.add(roleId)
    }
  }

  return { roleMetadataById, demonRoleIds }
}

const enrichPlayersWithRoleMetadata = (
  players: RawGameLog['players'],
  roleMetadataById: Map<string, RoleMetadata>,
): GameLog['players'] =>
  players.map(player => {
    const roleMetadata = roleMetadataById.get(player.role)
    return {
      ...player,
      roleName: roleMetadata?.name ?? player.role,
      roleImage: roleMetadata?.image,
    }
  })

const parseDateFromFilename = (filename: string): string => {
  const dateMatch = filename.match(/^(\d{4})(\d{2})(\d{2})/)
  if (!dateMatch) {
    return 'Unknown'
  }

  const [, year, month, day] = dateMatch
  return `${year}-${month}-${day}`
}

const resolveWinner = (
  filename: string,
  players: GameLog['players'],
  demonRoleIds: Set<string>,
): Alignment => {
  if (filename.includes('good')) {
    return 'good'
  }

  if (filename.includes('evil')) {
    return 'evil'
  }

  const aliveDemon = players.find(player => demonRoleIds.has(player.role) && !player.isDead)
  return aliveDemon ? 'evil' : 'good'
}

export const fetchGameLogs = async (): Promise<GameLog[]> => {
  try {
    const gameLogs = Object.entries(rawLogModulesByPath).map(([path, moduleValue]) => {
      const rawLog = resolveRawLog(moduleValue)
      const fileName = path.split('/').pop() ?? 'unknown.json'
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

    return gameLogs
  } catch (error) {
    console.error('Error loading local logs', error)
    return []
  }
}
