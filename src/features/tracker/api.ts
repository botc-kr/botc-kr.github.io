import { normalizeRoleIdForIcon } from '@/utils/normalizeRoleId'
import { Alignment, GameLog, RawGameLog, RoleDefinition, Team } from '@/features/tracker/types'

type RawLogModule = RawGameLog | { default: RawGameLog }

const localLogMap = import.meta.glob<RawLogModule>('../../logs/*.json', { eager: true })
const localIconMap = import.meta.glob<string>('../../assets/icons/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

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
    const gameLogs: GameLog[] = []

    for (const path in localLogMap) {
      const rawLog = resolveRawLog(localLogMap[path])
      const fileName = path.split('/').pop() ?? 'unknown.json'
      const date = parseDateFromFilename(fileName)

      const roleMap = new Map<string, { name: string; image: string; team?: Team }>()
      const demonRoleIds = new Set<string>()

      for (const role of rawLog.roles ?? []) {
        const roleId = readRoleField(role, 'id', '0')
        if (!roleId) {
          continue
        }

        const roleName = readRoleField(role, 'name', '1') ?? roleId
        const roleTeam = readRoleField(role, 'team', '12') as Team | undefined
        const normalizedRoleId = normalizeRoleIdForIcon(roleId)
        const iconPath = `../../assets/icons/Icon_${normalizedRoleId}.png`
        const localIconUrl = localIconMap[iconPath] ?? ''

        roleMap.set(roleId, { name: roleName, image: localIconUrl, team: roleTeam })

        if (roleTeam === 'demon') {
          demonRoleIds.add(roleId)
        }
      }

      const enhancedPlayers = rawLog.players.map(player => {
        const roleInfo = roleMap.get(player.role)
        return {
          ...player,
          roleName: roleInfo?.name ?? player.role,
          roleImage: roleInfo?.image,
        }
      })

      gameLogs.push({
        ...rawLog,
        players: enhancedPlayers,
        id: fileName,
        date,
        winner: resolveWinner(fileName, enhancedPlayers, demonRoleIds),
      })
    }

    return gameLogs
  } catch (error) {
    console.error('Error loading local logs', error)
    return []
  }
}
