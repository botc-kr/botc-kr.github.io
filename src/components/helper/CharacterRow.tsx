import { FC } from 'react'
import { Character, HelperTab } from '@/types/types'

type CharacterRowProps = {
  type: HelperTab
  character: Character
  //   order?: number
  onClick: (character: Character) => void
}

export const CharacterRow: FC<CharacterRowProps> = ({ type, character, onClick }) => (
  <div
    className="flex items-center gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
    onClick={() => onClick(character)}>
    {/* {order !== undefined && <div className="w-8 text-center font-medium text-gray-500">{order}</div>} */}
    <img src={character.image} alt={character.name} className="w-12 h-12 object-contain" />
    <div className="flex-1">
      <h3 className="font-semibold text-lg">{character.name}</h3>
      <p className="text-gray-600">
        {type === HelperTab.FirstNight && character.firstNightReminder}
        {type === HelperTab.OtherNight && character.otherNightReminder}
        {type === HelperTab.Characters && character.ability}
      </p>
    </div>
  </div>
)
