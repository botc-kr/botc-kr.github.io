import { FC, useCallback, useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ErrorState, LoadingState } from '@/components/AsyncState'
import { CharacterDialog } from '@/features/helper/components/CharacterDialog'
import { HelperScriptSelect } from '@/features/helper/components/HelperScriptSelect'
import HelperTabs from '@/features/helper/components/HelperTabs'
import { useHelperScriptSelection } from '@/features/helper/hooks/useHelperScriptSelection'
import { buildNightOrderCharacters } from '@/features/helper/services/nightOrderService'
import { fetchHelperScriptEntries } from '@/features/helper/services/helperScriptService'
import { ALL_GENERIC_INFO } from '@/constants/nightInfo'
import { Character, HelperEntry, HelperTab, Team, isCharacterEntry } from '@/features/helper/types'
import { useAsyncData } from '@/hooks/useAsyncData'

const Helper: FC = () => {
  const { selectedScriptId, selectedScript, handleScriptChange } = useHelperScriptSelection()
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

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
        <HelperTabs
          firstNightCharacters={firstNightCharacters}
          otherNightCharacters={otherNightCharacters}
          characters={characters}
          onCharacterSelect={setSelectedCharacter}
        />
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
