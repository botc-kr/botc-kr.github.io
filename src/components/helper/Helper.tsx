import { FC, useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs'
import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import { Character, HelperScriptMeta, Team, HelperTab } from '@/features/helper/types'
import { ALL_GENERIC_INFO, NIGHT_INFO } from '@/constants/nightInfo'
import { CharacterRow } from '@/components/helper/CharacterRow'
import { CharacterDialog } from '@/components/helper/CharacterDialog'
import { ChevronDownIcon } from 'lucide-react'
import { HELPER_SCRIPTS, HELPER_SELECTED_SCRIPT_STORAGE_KEY } from '@/components/helper/scripts'
import { normalizeRoleIdForIcon } from '@/utils/normalizeRoleId'
import type { HelperScriptId } from '@/components/helper/scripts'

const localIcons = import.meta.glob<string>('../../assets/icons/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
type HelperEntry = HelperScriptMeta | Character
const isCharacterEntry = (item: HelperEntry): item is Character =>
  item.id !== '_meta' && typeof (item as Character).firstNight === 'number'
const isHelperScriptId = (scriptId: string): scriptId is HelperScriptId =>
  HELPER_SCRIPTS.some(script => script.id === scriptId)

const Helper: FC = () => {
  // localStorage에서 저장된 스크립트를 가져오거나 기본값 사용
  const [selectedScript, setSelectedScript] = useState<HelperScriptId>(() => {
    const saved = localStorage.getItem(HELPER_SELECTED_SCRIPT_STORAGE_KEY)
    return saved && isHelperScriptId(saved) ? saved : HELPER_SCRIPTS[0].id
  })

  const [data, setData] = useState<HelperEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  // 스크립트 선택 시 localStorage에 저장
  const handleScriptChange = (scriptId: string) => {
    if (!isHelperScriptId(scriptId)) return
    setSelectedScript(scriptId)
    localStorage.setItem(HELPER_SELECTED_SCRIPT_STORAGE_KEY, scriptId)
  }

  useEffect(() => {
    const fetchScript = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const script = HELPER_SCRIPTS.find(s => s.id === selectedScript)
        if (!script) throw new Error('스크립트를 찾을 수 없습니다')

        const response = await fetch(script.url)
        if (!response.ok) {
          throw new Error('스크립트 데이터를 불러오는데 실패했습니다')
        }
        const jsonData = (await response.json()) as HelperEntry[]
        if (!Array.isArray(jsonData)) {
          throw new Error('스크립트 데이터 형식이 올바르지 않습니다')
        }

        // Override images with local assets
        const processedData = jsonData.map((item, index) => {
          if (!isCharacterEntry(item)) return item

          const cleanId = normalizeRoleIdForIcon(item.id)
          const iconKey = `../../assets/icons/Icon_${cleanId}.png`
          const localImage = localIcons[iconKey]

          if (!localImage && index < 5) {
            console.debug(`[Helper] Icon lookup failed for ${item.id}`, {
              cleanId,
              iconKey,
              hasKey: iconKey in localIcons,
              firstKey: Object.keys(localIcons)[0],
            })
          }

          const finalImage = localImage || item.image

          return {
            ...item,
            image: finalImage,
          }
        })

        setData(processedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : '스크립트를 불러오는데 실패했습니다')
      } finally {
        setIsLoading(false)
      }
    }

    fetchScript()
  }, [selectedScript])

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  const characters = (data.filter(item => item.id !== '_meta') as Character[]).filter(
    char => char.team !== Team.Traveler,
  )

  const firstNightCharacters = [
    ...NIGHT_INFO.filter(info => info.firstNightReminder !== ''),
    ...characters.filter(char => char.firstNight > 0),
  ].sort((a, b) => a.firstNight - b.firstNight)

  const otherNightCharacters = [
    ...NIGHT_INFO.filter(info => info.otherNightReminder !== ''),
    ...characters.filter(char => char.otherNight > 0),
  ].sort((a, b) => a.otherNight - b.otherNight)

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Select.Root value={selectedScript} onValueChange={handleScriptChange}>
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
      <h1 className="text-3xl font-bold">{HELPER_SCRIPTS.find(script => script.id === selectedScript)?.name}</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-[200px]">불러오는 중...</div>
      ) : (
        <Tabs defaultValue="firstNight">
          <TabsList className="flex space-x-2 border-b border-gray-200 mb-4">
            <TabsTrigger
              value="firstNight"
              className="px-4 py-2 focus:outline-none aria-selected:border-b-2 aria-selected:border-blue-500">
              첫날밤
            </TabsTrigger>
            <TabsTrigger
              value="otherNight"
              className="px-4 py-2 focus:outline-none aria-selected:border-b-2 aria-selected:border-blue-500">
              다른 밤
            </TabsTrigger>
            <TabsTrigger
              value="characters"
              className="px-4 py-2 focus:outline-none aria-selected:border-b-2 aria-selected:border-blue-500">
              캐릭터
            </TabsTrigger>
          </TabsList>

          <TabsContent value={HelperTab.FirstNight} className="bg-white rounded-lg shadow">
            {firstNightCharacters.map(char => (
              <CharacterRow
                type={HelperTab.FirstNight}
                key={char.id}
                character={char}
                // order={char.firstNight}
                onClick={setSelectedCharacter}
              />
            ))}
          </TabsContent>

          <TabsContent value={HelperTab.OtherNight} className="bg-white rounded-lg shadow">
            {otherNightCharacters.map(char => (
              <CharacterRow
                type={HelperTab.OtherNight}
                key={char.id}
                character={char}
                // order={char.otherNight}
                onClick={setSelectedCharacter}
              />
            ))}
          </TabsContent>

          <TabsContent value={HelperTab.Characters} className="bg-white rounded-lg shadow">
            {characters.map(char => (
              <CharacterRow type={HelperTab.Characters} key={char.id} character={char} onClick={setSelectedCharacter} />
            ))}
          </TabsContent>
        </Tabs>
      )}

      <Dialog.Root open={selectedCharacter !== null} onOpenChange={open => !open && setSelectedCharacter(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          {selectedCharacter && (
            <CharacterDialog character={selectedCharacter} script={characters} genericInfos={ALL_GENERIC_INFO} />
          )}
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default Helper
