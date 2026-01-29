import { GameLog, RawGameLog } from './types'

const localLogs = import.meta.glob('../../logs/*.json', { eager: true })
const localIcons = import.meta.glob('../../assets/icons/*.png', { eager: true, as: 'url' })

export const fetchGameLogs = async (): Promise<GameLog[]> => {
    try {
        const logs: GameLog[] = []

        for (const path in localLogs) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rawLog = localLogs[path] as RawGameLog

            const filename = path.split('/').pop() || 'unknown.json'
            // Parse Date from Filename: YYYYMMDD_Sequence.json
            const dateMatch = filename.match(/^(\d{4})(\d{2})(\d{2})/)
            const date = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : 'Unknown'

            // Create Role Lookup Map
            const roleMap = new Map<string, { name: string, image: string, team: string }>()
            const demonRoleIds = new Set<string>()

            if (rawLog.roles) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rawLog.roles.forEach((r: any) => {
                    // Log roles format: { "0": "id", "1": "Name", "2": "ImageURL", "12": "team" ... }
                    // OR standard fields if newer format. The sample uses indices.
                    const id = r.id || r['0']
                    const name = r.name || r['1']
                    // const image = r.image || r['2'] // Deprecated: External URL
                    const team = r.team || r['12']

                    // Resolve Local Image
                    // Filename format expected: Icon_<id>.png
                    // We need to handle potential case mismatches or just assume lower case matches logic if file is Icon_imp.png and id is imp.
                    // Actually, based on previous `ls` output, filenames are like `Icon_imp.png`.
                    // Strip 'kokr' prefix if present from the ID for icon lookup
                    const cleanId = id.replace(/^kokr/, '')
                    const iconKey = `../../assets/icons/Icon_${cleanId}.png`
                    const localImage = localIcons[iconKey] || ''

                    if (!localImage) {
                        console.debug(`[Tracker] Icon not found for id: ${id} (tried: ${cleanId})`, {
                            triedKey: iconKey,
                            availableKeys: Object.keys(localIcons).slice(0, 5) // Sample keys
                        })
                    }

                    if (id) {
                        roleMap.set(id, { name, image: localImage, team })
                    }

                    if (team === 'demon') {
                        demonRoleIds.add(id)
                    }
                })
            }

            // Enhance Players with Role Metadata
            const enhancedPlayers = rawLog.players.map(p => {
                const roleInfo = roleMap.get(p.role)
                return {
                    ...p,
                    roleName: roleInfo?.name || p.role,
                    roleImage: roleInfo?.image
                }
            })

            // Determine winner:
            // 1. Check filename for 'good' or 'evil' (e.g. 20260129_1_good_mayor_win.json)
            // 2. Fallback to alive demon check
            let winner = 'unknown'
            if (filename.includes('good')) {
                winner = 'good'
            } else if (filename.includes('evil')) {
                winner = 'evil'
            } else {
                const aliveDemon = enhancedPlayers.find(p =>
                    demonRoleIds.has(p.role) && !p.isDead
                )
                winner = aliveDemon ? 'evil' : 'good'
            }

            logs.push({
                ...rawLog,
                players: enhancedPlayers,
                id: filename,
                date,
                winner: winner as 'good' | 'evil'
            })
        }

        return logs
    } catch (err) {
        console.error('Error loading local logs', err)
        return []
    }
}
