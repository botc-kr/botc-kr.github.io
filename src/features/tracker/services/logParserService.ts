import { type Alignment, type GameLog, type RawGameLog, type RoleDefinition, type Team } from '@/features/tracker/types'
import { getRoleIconUrl } from '@/utils/roleIcon'

export type RawLogModule = RawGameLog | { default: RawGameLog }

type RoleMetadata = { name: string; image: string; team?: Team }

const TRACKER_TEAM_SET = new Set<Team>(['townsfolk', 'outsider', 'minion', 'demon', 'traveler'])

const readRoleField = (
  role: RoleDefinition,
  key: 'id' | 'name' | 'team',
  legacyKey: '0' | '1' | '12',
): string | undefined => {
  const value = role[key] ?? role[legacyKey]
  return typeof value === 'string' ? value : undefined
}

const parseRoleTeam = (value: string | undefined): Team | undefined => {
  if (!value || !TRACKER_TEAM_SET.has(value as Team)) {
    return undefined
  }

  return value as Team
}

export const resolveRawLog = (moduleValue: RawLogModule): RawGameLog =>
  'default' in moduleValue ? moduleValue.default : moduleValue

export const getLogFileNameFromPath = (path: string): string => path.split('/').pop() ?? 'unknown.json'

export const parseDateFromFilename = (fileName: string): string => {
  const dateMatch = fileName.match(/^(\d{4})(\d{2})(\d{2})/)
  if (!dateMatch) {
    return 'Unknown'
  }

  const [, year, month, day] = dateMatch
  return `${year}-${month}-${day}`
}

export const buildRoleMetadata = (roles: RoleDefinition[] = []) => {
  const roleMetadataById = new Map<string, RoleMetadata>()
  const demonRoleIds = new Set<string>()

  for (const role of roles) {
    const roleId = readRoleField(role, 'id', '0')
    if (!roleId) {
      continue
    }

    const roleName = readRoleField(role, 'name', '1') ?? roleId
    const roleTeam = parseRoleTeam(readRoleField(role, 'team', '12'))
    const iconUrl = getRoleIconUrl(roleId) ?? ''

    roleMetadataById.set(roleId, { name: roleName, image: iconUrl, team: roleTeam })

    if (roleTeam === 'demon') {
      demonRoleIds.add(roleId)
    }
  }

  return { roleMetadataById, demonRoleIds }
}

export const enrichPlayersWithRoleMetadata = (
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

export const resolveWinner = (
  fileName: string,
  players: GameLog['players'],
  demonRoleIds: Set<string>,
): Alignment => {
  if (fileName.includes('good')) {
    return 'good'
  }

  if (fileName.includes('evil')) {
    return 'evil'
  }

  const aliveDemon = players.find(player => demonRoleIds.has(player.role) && !player.isDead)
  return aliveDemon ? 'evil' : 'good'
}
