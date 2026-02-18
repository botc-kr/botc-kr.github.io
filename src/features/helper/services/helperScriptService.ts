import { HelperEntry, isCharacterEntry } from '@/features/helper/types'
import { fetchWithRetry } from '@/utils/fetchRetry'
import { normalizeRoleIdForIcon } from '@/utils/normalizeRoleId'

const localIconUrlMap = import.meta.glob<string>('../../../assets/icons/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

const findLocalIcon = (characterId: string): string | undefined => {
  const normalizedRoleId = normalizeRoleIdForIcon(characterId)
  const iconPath = `../../../assets/icons/Icon_${normalizedRoleId}.png`
  return localIconUrlMap[iconPath]
}

const applyLocalIconFallback = (entries: HelperEntry[]): HelperEntry[] =>
  entries.map(entry => {
    if (!isCharacterEntry(entry)) {
      return entry
    }

    const localIconUrl = findLocalIcon(entry.id)
    if (!localIconUrl) {
      return entry
    }

    return {
      ...entry,
      image: localIconUrl,
    }
  })

export const fetchHelperScriptEntries = async (scriptUrl: string): Promise<HelperEntry[]> => {
  const response = await fetchWithRetry(scriptUrl)
  const data = (await response.json()) as unknown

  if (!Array.isArray(data)) {
    throw new Error('스크립트 데이터 형식이 올바르지 않습니다')
  }

  return applyLocalIconFallback(data as HelperEntry[])
}
