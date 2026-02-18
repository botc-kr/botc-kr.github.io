import { FC, useCallback, useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import { ChevronDownIcon } from 'lucide-react'
import { CharacterDialog } from '@/features/helper/components/CharacterDialog'
import { CharacterRow } from '@/features/helper/components/CharacterRow'
import { HELPER_SCRIPTS, HELPER_SELECTED_SCRIPT_STORAGE_KEY } from '@/features/helper/scripts'
import { fetchHelperScriptEntries } from '@/features/helper/services/helperScriptService'
import { ALL_GENERIC_INFO, NIGHT_INFO } from '@/constants/nightInfo'
import { Character, HelperEntry, HelperTab, Team, isCharacterEntry } from '@/features/helper/types'
import type { HelperScriptId } from '@/features/helper/scripts'
import { useAsyncData } from '@/hooks/useAsyncData'

const isHelperScriptId = (scriptId: string): scriptId is HelperScriptId =>
  HELPER_SCRIPTS.some(script => script.id === scriptId)

const getStoredScriptId = (): HelperScriptId => {
  const savedScriptId = localStorage.getItem(HELPER_SELECTED_SCRIPT_STORAGE_KEY)
  return savedScriptId && isHelperScriptId(savedScriptId) ? savedScriptId : HELPER_SCRIPTS[0].id
}

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
  const [selectedScriptId, setSelectedScriptId] = useState<HelperScriptId>(getStoredScriptId)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const selectedScript = useMemo(() => HELPER_SCRIPTS.find(script => script.id === selectedScriptId), [selectedScriptId])

  const loadSelectedScriptEntries = useCallback(async (): Promise<HelperEntry[]> => {
    if (!selectedScript) {
      throw new Error('스크립트를 찾을 수 없습니다')
    }

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
  const selectedScriptName = useMemo(
    () => HELPER_SCRIPTS.find(script => script.id === selectedScriptId)?.name ?? '',
    [selectedScriptId],
  )

  const handleScriptChange = (scriptId: string): void => {
    if (!isHelperScriptId(scriptId)) {
      return
    }

    setSelectedScriptId(scriptId)
    localStorage.setItem(HELPER_SELECTED_SCRIPT_STORAGE_KEY, scriptId)
  }

  if (loadError) {
    return <div className="flex justify-center items-center h-screen text-red-500">{loadError}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Select.Root value={selectedScriptId} onValueChange={handleScriptChange}>
          <Select.Trigger className="inline-flex items-center justify-between rounded px-4 py-2 text-sm gap-2 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none min-w-[200px]">
            <Select.Value placeholder="스크립트 선택" />
            <Select.Icon>
              <ChevronDownIcon className="w-4 h-4" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200">
              <Select.Viewport className="p-1">
                {HELPER_SCRIPTS.map(script => (
                  <Select.Item
                    key={script.id}
                    value={script.id}
                    className="relative flex items-center px-8 py-2 text-sm text-gray-700 rounded-sm hover:bg-gray-100 focus:bg-gray-100 cursor-pointer outline-none select-none">
                    <Select.ItemText>{script.name}</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"></path>
                      </svg>
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <h1 className="text-3xl font-bold">{selectedScriptName}</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-[200px]">불러오는 중...</div>
      ) : (
        <Tabs defaultValue={HelperTab.FirstNight}>
          <TabsList className="flex space-x-2 border-b border-gray-200 mb-4">
            <TabsTrigger
              value={HelperTab.FirstNight}
              className="px-4 py-2 focus:outline-none aria-selected:border-b-2 aria-selected:border-blue-500">
              첫날밤
            </TabsTrigger>
            <TabsTrigger
              value={HelperTab.OtherNight}
              className="px-4 py-2 focus:outline-none aria-selected:border-b-2 aria-selected:border-blue-500">
              다른 밤
            </TabsTrigger>
            <TabsTrigger
              value={HelperTab.Characters}
              className="px-4 py-2 focus:outline-none aria-selected:border-b-2 aria-selected:border-blue-500">
              캐릭터
            </TabsTrigger>
          </TabsList>

          <TabsContent value={HelperTab.FirstNight} className="bg-white rounded-lg shadow">
            {firstNightCharacters.map(character => (
              <CharacterRow
                key={character.id}
                type={HelperTab.FirstNight}
                character={character}
                onClick={setSelectedCharacter}
              />
            ))}
          </TabsContent>

          <TabsContent value={HelperTab.OtherNight} className="bg-white rounded-lg shadow">
            {otherNightCharacters.map(character => (
              <CharacterRow
                key={character.id}
                type={HelperTab.OtherNight}
                character={character}
                onClick={setSelectedCharacter}
              />
            ))}
          </TabsContent>

          <TabsContent value={HelperTab.Characters} className="bg-white rounded-lg shadow">
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
