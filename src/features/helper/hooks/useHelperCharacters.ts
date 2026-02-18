import { useMemo } from 'react'
import { buildNightOrderCharacters } from '@/features/helper/services/nightOrderService'
import { Character, HelperEntry, HelperTab, Team, isCharacterEntry } from '@/features/helper/types'

interface UseHelperCharactersReturn {
  characters: Character[]
  firstNightCharacters: Character[]
  otherNightCharacters: Character[]
}

export const useHelperCharacters = (entries: HelperEntry[]): UseHelperCharactersReturn => {
  const characters = useMemo(
    () => entries.filter(isCharacterEntry).filter(character => character.team !== Team.Traveler),
    [entries],
  )
  const firstNightCharacters = useMemo(
    () => buildNightOrderCharacters(characters, HelperTab.FirstNight),
    [characters],
  )
  const otherNightCharacters = useMemo(
    () => buildNightOrderCharacters(characters, HelperTab.OtherNight),
    [characters],
  )

  return {
    characters,
    firstNightCharacters,
    otherNightCharacters,
  }
}
