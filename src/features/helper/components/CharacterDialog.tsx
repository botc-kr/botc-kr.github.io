import { FC, useMemo, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronLeft, X } from 'lucide-react'
import { Alignment, Character, HelperInfo } from '@/features/helper/types'
import { getCharacterInfos } from '@/features/helper/components/characterInfoMap'

type CharacterDialogProps = {
  character: Character
  scriptCharacters: Character[]
  genericInfos: Record<string, HelperInfo>
}

type InfoCardButtonProps = {
  info: HelperInfo
  onSelect: (info: HelperInfo) => void
}

const InfoCardButton: FC<InfoCardButtonProps> = ({ info, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(info)}
    className="w-full p-4 border rounded-lg text-left hover:bg-gray-50">
    <h3 className="font-semibold">{info.title}</h3>
  </button>
)

export const CharacterDialog: FC<CharacterDialogProps> = ({ character, scriptCharacters, genericInfos }) => {
  const contentRef = useRef<HTMLDivElement>(null)

  const [selectedInfo, setSelectedInfo] = useState<HelperInfo | null>(null)
  const [selectedCharacters, setSelectedCharacters] = useState<Set<string>>(new Set())
  const [selectedAlignment, setSelectedAlignment] = useState<Alignment>(Alignment.Good)

  const characterInfos = useMemo(() => getCharacterInfos(character.id), [character.id])
  const selectedCharactersList = useMemo(() => Array.from(selectedCharacters), [selectedCharacters])
  const selectedScriptCharacters = useMemo(
    () => scriptCharacters.filter(char => selectedCharacters.has(char.id)),
    [scriptCharacters, selectedCharacters],
  )
  const eligibleCharacters = useMemo(() => {
    if (!selectedInfo?.teams) return []
    return scriptCharacters.filter(char => char.team !== undefined && selectedInfo.teams?.includes(char.team))
  }, [scriptCharacters, selectedInfo])
  const firstSelectedCharacterName = useMemo(() => {
    if (selectedCharactersList.length === 0) {
      return ''
    }
    const firstCharacter = scriptCharacters.find(char => char.id === selectedCharactersList[0])
    return firstCharacter ? `'${firstCharacter.name}'` : ''
  }, [scriptCharacters, selectedCharactersList])

  const handleBackClick = () => {
    setSelectedInfo(null)
    setSelectedCharacters(new Set())
  }

  const handleInfoClick = (info: HelperInfo) => {
    setSelectedInfo(info)
    setSelectedCharacters(new Set())
  }

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacters(prev => {
      const nextSelection = Array.from(prev)
      const isAlreadySelected = nextSelection.includes(characterId)
      const maxCount = selectedInfo?.count ?? Number.POSITIVE_INFINITY

      if (isAlreadySelected) {
        return new Set(nextSelection.filter(id => id !== characterId))
      }

      if (maxCount <= 0) {
        return prev
      }

      if (nextSelection.length >= maxCount) {
        nextSelection.shift()
      }

      nextSelection.push(characterId)

      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0 })
      }

      return new Set(nextSelection)
    })
  }

  const renderSelectedCharacters = () => {
    return (
      <div className="mx-auto">
        {selectedScriptCharacters.length === 0 ? (
          <div className="p-6 border-2 border-dashed rounded-lg bg-gray-50">
            <p className="text-gray-500 text-center text-base">{selectedInfo?.count}명의 캐릭터를 선택하세요</p>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            {selectedScriptCharacters.map(char => (
              <button
                key={char.id}
                type="button"
                onClick={() => handleCharacterSelect(char.id)}
                className="group relative flex flex-col items-center">
                <img src={char.image} alt={char.name} className="w-40 h-40 object-contain mb-2" />
                <span className="text-m text-center font-medium">{char.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderCharacterGrid = () => {
    return (
      <div className="grid grid-cols-3 gap-2">
        {eligibleCharacters.map(char => (
          <button
            key={char.id}
            type="button"
            onClick={() => handleCharacterSelect(char.id)}
            className={`p-2 rounded-lg border flex flex-col items-center ${
              selectedCharacters.has(char.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
            }`}
            disabled={Boolean(selectedInfo?.count !== undefined && selectedInfo.count <= 0)}>
            <img src={char.image} alt={char.name} className="w-12 h-12 object-contain mb-1" />
            <span className="text-xs text-center font-medium">{char.name}</span>
          </button>
        ))}
      </div>
    )
  }

  const renderAlignmentButton = () => {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">진영 선택</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSelectedAlignment(Alignment.Good)}
            className={`p-4 rounded-lg border flex justify-center items-center ${
              selectedAlignment === Alignment.Good ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
            }`}>
            <span className="text-sm font-medium">선</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedAlignment(Alignment.Evil)}
            className={`p-4 rounded-lg border flex justify-center items-center ${
              selectedAlignment === Alignment.Evil ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
            }`}>
            <span className="text-sm font-medium">악</span>
          </button>
        </div>
      </div>
    )
  }

  const formatMessage = (message: string) => {
    return message
      .replace(/{character}/g, firstSelectedCharacterName)
      .replace(/{alignment}/g, selectedAlignment === Alignment.Good ? '선한 진영' : '악한 진영')
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
              <p className="text-4xl leading-normal font-bold text-center">{formatMessage(selectedInfo.message)}</p>
              {selectedInfo.teams && (
                <div className="space-y-4">
                  {renderSelectedCharacters()}
                  <div className="h-px bg-gray-200" />
                  {renderCharacterGrid()}
                  <div className="h-px bg-gray-200" />
                </div>
              )}
              {selectedInfo.isAlignment && renderAlignmentButton()}
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
