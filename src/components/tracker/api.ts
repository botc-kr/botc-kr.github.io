import { Alignment, GameLog, RawGameLog, RoleDefinition, Team } from './types'
import { normalizeRoleIdForIcon } from '@/utils/normalizeRoleId'

type LogModule = RawGameLog | { default: RawGameLog }

const localLogs = import.meta.glob<LogModule>('../../logs/*.json', { eager: true })
const localIcons = import.meta.glob<string>('../../assets/icons/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

const readRoleString = (
  role: RoleDefinition,
  key: 'id' | 'name' | 'team',
  legacyKey: '0' | '1' | '12',
): string | undefined => {
  const value = role[key] ?? role[legacyKey]
  return typeof value === 'string' ? value : undefined
}

const resolveRawLog = (moduleValue: LogModule): RawGameLog =>
  'default' in moduleValue ? moduleValue.default : moduleValue

export const fetchGameLogs = async (): Promise<GameLog[]> => {
  try {
    const logs: GameLog[] = []

    for (const path in localLogs) {
      const rawLog = resolveRawLog(localLogs[path])
      const filename = path.split('/').pop() ?? 'unknown.json'
      const dateMatch = filename.match(/^(\d{4})(\d{2})(\d{2})/)
      const date = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : 'Unknown'

      const roleMap = new Map<string, { name: string; image: string; team?: Team }>()
      const demonRoleIds = new Set<string>()

      for (const role of rawLog.roles ?? []) {
        const id = readRoleString(role, 'id', '0')
        if (!id) continue

        const name = readRoleString(role, 'name', '1') ?? id
        const team = readRoleString(role, 'team', '12') as Team | undefined

        const cleanId = normalizeRoleIdForIcon(id)
        const iconKey = `../../assets/icons/Icon_${cleanId}.png`
        const localImage = localIcons[iconKey] ?? ''

        if (!localImage) {
          console.debug(`[Tracker] Icon not found for id: ${id} (tried: ${cleanId})`, {
            triedKey: iconKey,
            availableKeys: Object.keys(localIcons).slice(0, 5),
          })
        }

        roleMap.set(id, { name, image: localImage, team })
        if (team === 'demon') demonRoleIds.add(id)
      }

      const enhancedPlayers = rawLog.players.map(player => {
        const roleInfo = roleMap.get(player.role)
        return {
          ...player,
          roleName: roleInfo?.name ?? player.role,
          roleImage: roleInfo?.image,
        }
      })

      let winner: Alignment
      if (filename.includes('good')) {
        winner = 'good'
      } else if (filename.includes('evil')) {
        winner = 'evil'
      } else {
        const aliveDemon = enhancedPlayers.find(player => demonRoleIds.has(player.role) && !player.isDead)
        winner = aliveDemon ? 'evil' : 'good'
      }

      logs.push({
        ...rawLog,
        players: enhancedPlayers,
        id: filename,
        date,
        winner,
      })
    }

    return logs
  } catch (err) {
    console.error('Error loading local logs', err)
    return []
  }
}
