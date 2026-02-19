import { HelperEntry, Team, isCharacterEntry, isHelperEntry, isHelperScriptMeta } from '@/features/helper/types'
import { fetchJsonWithRetry } from '@/utils/fetchJson'
import { getRoleIconUrl } from '@/utils/roleIcon'

const applyLocalIconFallback = (entries: HelperEntry[]): HelperEntry[] =>
  entries.map(entry => {
    if (!isCharacterEntry(entry)) {
      return entry
    }

    const localIconUrl = getRoleIconUrl(entry.id)
    if (!localIconUrl) {
      return entry
    }

    return {
      ...entry,
      image: localIconUrl,
    }
  })

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const TEAM_VALUES = new Set<string>(Object.values(Team))

const normalizeCharacterEntry = (item: Record<string, unknown>): HelperEntry | null => {
  if (typeof item.id !== 'string' || item.id === '_meta') {
    return null
  }

  const team =
    typeof item.team === 'string' && TEAM_VALUES.has(item.team)
      ? (item.team as Team)
      : undefined

  return {
    id: item.id,
    name: typeof item.name === 'string' ? item.name : '',
    image: typeof item.image === 'string' ? item.image : '',
    firstNight: typeof item.firstNight === 'number' ? item.firstNight : 0,
    firstNightReminder: typeof item.firstNightReminder === 'string' ? item.firstNightReminder : '',
    otherNight: typeof item.otherNight === 'number' ? item.otherNight : 0,
    otherNightReminder: typeof item.otherNightReminder === 'string' ? item.otherNightReminder : '',
    ability: typeof item.ability === 'string' ? item.ability : '',
    ...(team ? { team } : {}),
  }
}

const normalizeHelperEntries = (data: unknown[]): HelperEntry[] | null => {
  const normalized: HelperEntry[] = []

  for (const item of data) {
    if (isHelperScriptMeta(item)) {
      normalized.push(item)
      continue
    }

    if (!isRecord(item)) {
      return null
    }

    const characterEntry = normalizeCharacterEntry(item)
    if (!characterEntry) {
      return null
    }

    normalized.push(characterEntry)
  }

  return normalized.every(isHelperEntry) ? normalized : null
}

export const fetchHelperScriptEntries = async (scriptUrl: string, signal?: AbortSignal): Promise<HelperEntry[]> => {
  const data = await fetchJsonWithRetry<unknown>(scriptUrl, { signal })

  if (!Array.isArray(data)) {
    throw new Error('스크립트 데이터 형식이 올바르지 않습니다')
  }

  const normalizedEntries = normalizeHelperEntries(data)
  if (!normalizedEntries) {
    throw new Error('스크립트 데이터 형식이 올바르지 않습니다')
  }

  return applyLocalIconFallback(normalizedEntries)
}
