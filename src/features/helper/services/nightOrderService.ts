import { NIGHT_INFO } from '@/constants/nightInfo'
import { Character, HelperTab } from '@/features/helper/types'

export const buildNightOrderCharacters = (
  characters: Character[],
  tab: HelperTab.FirstNight | HelperTab.OtherNight,
): Character[] => {
  const isFirstNight = tab === HelperTab.FirstNight
  const orderKey = isFirstNight ? 'firstNight' : 'otherNight'
  const reminderKey = isFirstNight ? 'firstNightReminder' : 'otherNightReminder'

  const prebuiltNightEntries = NIGHT_INFO.filter(entry => entry[reminderKey] !== '')
  const playableCharacters = characters.filter(character => character[orderKey] > 0)

  return [...prebuiltNightEntries, ...playableCharacters].sort((a, b) => a[orderKey] - b[orderKey])
}
