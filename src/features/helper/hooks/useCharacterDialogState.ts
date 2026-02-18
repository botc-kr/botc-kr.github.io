import { useCallback, useMemo, useState } from 'react'
import { getCharacterInfos } from '@/features/helper/components/characterInfoMap'
import { Alignment, type Character, type HelperInfo } from '@/features/helper/types'

interface UseCharacterDialogStateParams {
  characterId: string
  scriptCharacters: Character[]
  onCharacterSelectionChange?: () => void
}

interface UseCharacterDialogStateReturn {
  characterInfos: HelperInfo[]
  selectedInfo: HelperInfo | null
  selectedCharacterIds: Set<string>
  selectedScriptCharacters: Character[]
  eligibleCharacters: Character[]
  firstSelectedCharacterName: string
  selectedAlignment: Alignment
  setSelectedAlignment: (alignment: Alignment) => void
  handleBackClick: () => void
  handleInfoClick: (info: HelperInfo) => void
  handleCharacterSelect: (characterId: string) => void
}

export const useCharacterDialogState = ({
  characterId,
  scriptCharacters,
  onCharacterSelectionChange,
}: UseCharacterDialogStateParams): UseCharacterDialogStateReturn => {
  const [selectedInfo, setSelectedInfo] = useState<HelperInfo | null>(null)
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<Set<string>>(new Set())
  const [selectedAlignment, setSelectedAlignment] = useState<Alignment>(Alignment.Good)

  const characterInfos = useMemo(() => getCharacterInfos(characterId), [characterId])
  const selectedCharacterIdList = useMemo(() => Array.from(selectedCharacterIds), [selectedCharacterIds])
  const selectedScriptCharacters = useMemo(
    () => scriptCharacters.filter(scriptCharacter => selectedCharacterIds.has(scriptCharacter.id)),
    [scriptCharacters, selectedCharacterIds],
  )
  const eligibleCharacters = useMemo(() => {
    if (!selectedInfo?.teams) {
      return []
    }

    const selectedTeams = selectedInfo.teams

    return scriptCharacters.filter(
      scriptCharacter => scriptCharacter.team !== undefined && selectedTeams.includes(scriptCharacter.team),
    )
  }, [scriptCharacters, selectedInfo])
  const firstSelectedCharacterName = useMemo(() => {
    if (selectedCharacterIdList.length === 0) {
      return ''
    }

    const firstCharacter = scriptCharacters.find(scriptCharacter => scriptCharacter.id === selectedCharacterIdList[0])
    return firstCharacter ? `'${firstCharacter.name}'` : ''
  }, [scriptCharacters, selectedCharacterIdList])

  const resetSelection = useCallback((): void => {
    setSelectedCharacterIds(new Set())
  }, [])

  const handleBackClick = useCallback((): void => {
    setSelectedInfo(null)
    resetSelection()
  }, [resetSelection])

  const handleInfoClick = useCallback(
    (info: HelperInfo): void => {
      setSelectedInfo(info)
      resetSelection()
    },
    [resetSelection],
  )

  const handleCharacterSelect = useCallback(
    (characterId: string): void => {
      setSelectedCharacterIds(previousSelectedCharacterIds => {
        const nextSelectedCharacterIds = Array.from(previousSelectedCharacterIds)
        const isAlreadySelected = nextSelectedCharacterIds.includes(characterId)
        const maxCount = selectedInfo?.count ?? Number.POSITIVE_INFINITY

        if (isAlreadySelected) {
          return new Set(nextSelectedCharacterIds.filter(selectedId => selectedId !== characterId))
        }

        if (maxCount <= 0) {
          return previousSelectedCharacterIds
        }

        if (nextSelectedCharacterIds.length >= maxCount) {
          nextSelectedCharacterIds.shift()
        }

        nextSelectedCharacterIds.push(characterId)
        onCharacterSelectionChange?.()

        return new Set(nextSelectedCharacterIds)
      })
    },
    [onCharacterSelectionChange, selectedInfo?.count],
  )

  return {
    characterInfos,
    selectedInfo,
    selectedCharacterIds,
    selectedScriptCharacters,
    eligibleCharacters,
    firstSelectedCharacterName,
    selectedAlignment,
    setSelectedAlignment,
    handleBackClick,
    handleInfoClick,
    handleCharacterSelect,
  }
}
