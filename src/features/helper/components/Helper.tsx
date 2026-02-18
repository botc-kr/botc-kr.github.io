import { FC, useCallback, useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import * as Dialog from '@radix-ui/react-dialog'
import { ErrorState, LoadingState } from '@/components/AsyncState'
import { CharacterDialog } from '@/features/helper/components/CharacterDialog'
import { CharacterRow } from '@/features/helper/components/CharacterRow'
import { HelperScriptSelect } from '@/features/helper/components/HelperScriptSelect'
import {
  HELPER_SELECTED_SCRIPT_STORAGE_KEY,
  getHelperScriptById,
  getInitialHelperScriptId,
  isHelperScriptId,
} from '@/features/helper/scripts'
import { fetchHelperScriptEntries } from '@/features/helper/services/helperScriptService'
import { ALL_GENERIC_INFO, NIGHT_INFO } from '@/constants/nightInfo'
import { Character, HelperEntry, HelperTab, Team, isCharacterEntry } from '@/features/helper/types'
import type { HelperScriptId } from '@/features/helper/scripts'
import { useAsyncData } from '@/hooks/useAsyncData'

const buildNightOrderCharacters = (
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

const Helper: FC = () => {
  const [selectedScriptId, setSelectedScriptId] = useState<HelperScriptId>(getInitialHelperScriptId)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const selectedScript = useMemo(() => getHelperScriptById(selectedScriptId), [selectedScriptId])

  const loadSelectedScriptEntries = useCallback(async (): Promise<HelperEntry[]> => {
    return fetchHelperScriptEntries(selectedScript.url)
  }, [selectedScript])

  const getLoadErrorMessage = useCallback(
    (error: unknown): string => (error instanceof Error ? error.message : '스크립트를 불러오는데 실패했습니다'),
    [],
  )

  const { data: entries, isLoading, error: loadError } = useAsyncData<HelperEntry[]>(loadSelectedScriptEntries, [], {
    getErrorMessage: getLoadErrorMessage,
  })

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
  const selectedScriptName = selectedScript.name

  const handleScriptChange = (scriptId: string): void => {
    if (!isHelperScriptId(scriptId)) {
      return
    }

    setSelectedScriptId(scriptId)
    localStorage.setItem(HELPER_SELECTED_SCRIPT_STORAGE_KEY, scriptId)
  }

  if (loadError) {
    return <ErrorState className="h-screen" message={loadError} />
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <HelperScriptSelect selectedScriptId={selectedScriptId} onScriptChange={handleScriptChange} />
      </div>

      <h1 className="text-3xl font-bold">{selectedScriptName}</h1>

      {isLoading ? (
        <LoadingState className="h-[200px]" message="불러오는 중..." />
      ) : (
        <Tabs defaultValue={HelperTab.FirstNight}>
          <TabsList className="flex space-x-2 border-b border-gray-200 mb-4">
            <TabsTrigger
              value={HelperTab.FirstNight}
              className="px-4 py-2 focus:outline-hidden aria-selected:border-b-2 aria-selected:border-blue-500">
              첫날밤
            </TabsTrigger>
            <TabsTrigger
              value={HelperTab.OtherNight}
              className="px-4 py-2 focus:outline-hidden aria-selected:border-b-2 aria-selected:border-blue-500">
              다른 밤
            </TabsTrigger>
            <TabsTrigger
              value={HelperTab.Characters}
              className="px-4 py-2 focus:outline-hidden aria-selected:border-b-2 aria-selected:border-blue-500">
              캐릭터
            </TabsTrigger>
          </TabsList>

          <TabsContent value={HelperTab.FirstNight} className="bg-white rounded-lg shadow-sm">
            {firstNightCharacters.map(character => (
              <CharacterRow
                key={character.id}
                type={HelperTab.FirstNight}
                character={character}
                onClick={setSelectedCharacter}
              />
            ))}
          </TabsContent>

          <TabsContent value={HelperTab.OtherNight} className="bg-white rounded-lg shadow-sm">
            {otherNightCharacters.map(character => (
              <CharacterRow
                key={character.id}
                type={HelperTab.OtherNight}
                character={character}
                onClick={setSelectedCharacter}
              />
            ))}
          </TabsContent>

          <TabsContent value={HelperTab.Characters} className="bg-white rounded-lg shadow-sm">
            {characters.map(character => (
              <CharacterRow
                key={character.id}
                type={HelperTab.Characters}
                character={character}
                onClick={setSelectedCharacter}
              />
            ))}
          </TabsContent>
        </Tabs>
      )}

      <Dialog.Root open={selectedCharacter !== null} onOpenChange={open => !open && setSelectedCharacter(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          {selectedCharacter && (
            <CharacterDialog
              character={selectedCharacter}
              scriptCharacters={characters}
              genericInfos={ALL_GENERIC_INFO}
            />
          )}
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default Helper
