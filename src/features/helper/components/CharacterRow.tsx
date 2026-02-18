import { FC } from 'react'
import { Character, HelperTab } from '@/features/helper/types'

type CharacterRowProps = {
  type: HelperTab
  character: Character
  onClick: (character: Character) => void
}

export const CharacterRow: FC<CharacterRowProps> = ({ type, character, onClick }) => (
  <button
    type="button"
    className="w-full flex items-center gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer text-left"
    onClick={() => onClick(character)}>
    <img src={character.image} alt={character.name} className="w-12 h-12 object-contain shrink-0" />
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-lg">{character.name}</h3>
      <p className="text-gray-600">
        {type === HelperTab.FirstNight && character.firstNightReminder}
        {type === HelperTab.OtherNight && character.otherNightReminder}
        {type === HelperTab.Characters && character.ability}
      </p>
    </div>
  </button>
)
