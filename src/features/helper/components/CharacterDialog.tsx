import { type FC, useMemo, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronLeft, X } from 'lucide-react'
import { AlignmentSelector } from '@/features/helper/components/dialog/AlignmentSelector'
import { CharacterSelectionPanel } from '@/features/helper/components/dialog/CharacterSelectionPanel'
import { InfoCardButton } from '@/features/helper/components/dialog/InfoCardButton'
import { getCharacterInfos } from '@/features/helper/components/characterInfoMap'
import { formatHelperMessage } from '@/features/helper/services/helperMessageFormatter'
import { Alignment, type Character, type HelperInfo } from '@/features/helper/types'

type CharacterDialogProps = {
  character: Character
  scriptCharacters: Character[]
  genericInfos: Record<string, HelperInfo>
}

export const CharacterDialog: FC<CharacterDialogProps> = ({ character, scriptCharacters, genericInfos }) => {
  const contentRef = useRef<HTMLDivElement>(null)

  const [selectedInfo, setSelectedInfo] = useState<HelperInfo | null>(null)
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<Set<string>>(new Set())
  const [selectedAlignment, setSelectedAlignment] = useState<Alignment>(Alignment.Good)

  const characterInfos = useMemo(() => getCharacterInfos(character.id), [character.id])
  const selectedCharacterIdList = useMemo(() => Array.from(selectedCharacterIds), [selectedCharacterIds])
  const selectedScriptCharacters = useMemo(
    () => scriptCharacters.filter(scriptCharacter => selectedCharacterIds.has(scriptCharacter.id)),
    [scriptCharacters, selectedCharacterIds],
  )
  const eligibleCharacters = useMemo(() => {
    if (!selectedInfo?.teams) {
      return []
    }

    return scriptCharacters.filter(
      scriptCharacter => scriptCharacter.team !== undefined && selectedInfo.teams?.includes(scriptCharacter.team),
    )
  }, [scriptCharacters, selectedInfo])
  const firstSelectedCharacterName = useMemo(() => {
    if (selectedCharacterIdList.length === 0) {
      return ''
    }

    const firstCharacter = scriptCharacters.find(scriptCharacter => scriptCharacter.id === selectedCharacterIdList[0])
    return firstCharacter ? `'${firstCharacter.name}'` : ''
  }, [scriptCharacters, selectedCharacterIdList])

  const handleBackClick = (): void => {
    setSelectedInfo(null)
    setSelectedCharacterIds(new Set())
  }

  const handleInfoClick = (info: HelperInfo): void => {
    setSelectedInfo(info)
    setSelectedCharacterIds(new Set())
  }

  const handleCharacterSelect = (characterId: string): void => {
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

      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0 })
      }

      return new Set(nextSelectedCharacterIds)
    })
  }

  return (
    <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md bg-white rounded-lg flex flex-col max-h-[80vh]">
      <div className="p-6 pb-0">
        <div className="flex items-center gap-4 mb-6">
          <img src={character.image} alt={character.name} className="w-16 h-16 object-contain" />
          <div>
            <h2 className="text-2xl font-bold">{character.name}</h2>
            <p className="text-gray-700">{character.ability}</p>
          </div>
        </div>
      </div>

      <div ref={contentRef} className="flex-1 overflow-y-auto px-6 pb-6">
        {selectedInfo ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleBackClick}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-4 w-4" />
              뒤로 가기
            </button>
            <div>
              <p className="text-4xl leading-normal font-bold text-center">
                {formatHelperMessage(selectedInfo.message, firstSelectedCharacterName, selectedAlignment)}
              </p>
              {selectedInfo.teams && (
                <CharacterSelectionPanel
                  selectedCharacters={selectedScriptCharacters}
                  selectedCharacterIds={selectedCharacterIds}
                  eligibleCharacters={eligibleCharacters}
                  selectionLimit={selectedInfo.count}
                  onCharacterSelect={handleCharacterSelect}
                />
              )}
              {selectedInfo.isAlignment && (
                <AlignmentSelector selectedAlignment={selectedAlignment} onSelectAlignment={setSelectedAlignment} />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {characterInfos.length > 0 && <h2 className="text-l font-bold text-gray-900">{character.name} 정보</h2>}
            {characterInfos.map((info, index) => (
              <InfoCardButton key={`${info.title}-${index}`} info={info} onSelect={handleInfoClick} />
            ))}
            <h2 className="text-l font-bold text-gray-900">일반 정보</h2>
            {Object.entries(genericInfos).map(([key, info]) => (
              <InfoCardButton key={key} info={info} onSelect={handleInfoClick} />
            ))}
          </div>
        )}
      </div>

      <Dialog.Close className="absolute top-4 right-4">
        <X className="h-4 w-4" />
      </Dialog.Close>
    </Dialog.Content>
  )
}

export default CharacterDialog
