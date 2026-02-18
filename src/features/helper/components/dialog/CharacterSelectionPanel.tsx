import type { FC } from 'react'
import { Character } from '@/features/helper/types'

interface CharacterSelectionPanelProps {
  selectedCharacters: Character[]
  selectedCharacterIds: Set<string>
  eligibleCharacters: Character[]
  selectionLimit?: number
  onCharacterSelect: (characterId: string) => void
}

const getSelectableCharacterClassName = (isSelected: boolean): string =>
  `p-2 rounded-lg border flex flex-col items-center ${
    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
  }`

export const CharacterSelectionPanel: FC<CharacterSelectionPanelProps> = ({
  selectedCharacters,
  selectedCharacterIds,
  eligibleCharacters,
  selectionLimit,
  onCharacterSelect,
}) => (
  <div className="space-y-4">
    <div className="mx-auto">
      {selectedCharacters.length === 0 ? (
        <div className="p-6 border-2 border-dashed rounded-lg bg-gray-50">
          <p className="text-gray-500 text-center text-base">{selectionLimit}명의 캐릭터를 선택하세요</p>
        </div>
      ) : (
        <div className="flex justify-center gap-4">
          {selectedCharacters.map(character => (
            <button
              key={character.id}
              type="button"
              onClick={() => onCharacterSelect(character.id)}
              className="group relative flex flex-col items-center">
              <img src={character.image} alt={character.name} className="w-40 h-40 object-contain mb-2" />
              <span className="text-m text-center font-medium">{character.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>

    <div className="h-px bg-gray-200" />

    <div className="grid grid-cols-3 gap-2">
      {eligibleCharacters.map(character => (
        <button
          key={character.id}
          type="button"
          onClick={() => onCharacterSelect(character.id)}
          className={getSelectableCharacterClassName(selectedCharacterIds.has(character.id))}
          disabled={Boolean(selectionLimit !== undefined && selectionLimit <= 0)}>
          <img src={character.image} alt={character.name} className="w-12 h-12 object-contain mb-1" />
          <span className="text-xs text-center font-medium">{character.name}</span>
        </button>
      ))}
    </div>

    <div className="h-px bg-gray-200" />
  </div>
)
