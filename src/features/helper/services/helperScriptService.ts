import { HelperEntry, isCharacterEntry, isHelperEntry } from '@/features/helper/types'
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

export const fetchHelperScriptEntries = async (scriptUrl: string, signal?: AbortSignal): Promise<HelperEntry[]> => {
  const data = await fetchJsonWithRetry<unknown>(scriptUrl, { signal })

  if (!Array.isArray(data) || !data.every(isHelperEntry)) {
    throw new Error('스크립트 데이터 형식이 올바르지 않습니다')
  }

  return applyLocalIconFallback(data)
}
