import type { FC } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { CharacterRow } from '@/features/helper/components/CharacterRow'
import { Character, HelperTab } from '@/features/helper/types'

interface HelperTabsProps {
  firstNightCharacters: Character[]
  otherNightCharacters: Character[]
  characters: Character[]
  onCharacterSelect: (character: Character) => void
}

interface TabDefinition {
  value: HelperTab
  label: string
  rows: Character[]
}

const TAB_DEFINITIONS: Pick<TabDefinition, 'value' | 'label'>[] = [
  { value: HelperTab.FirstNight, label: '첫날밤' },
  { value: HelperTab.OtherNight, label: '다른 밤' },
  { value: HelperTab.Characters, label: '캐릭터' },
]

const tabTriggerClassName =
  'px-4 py-2 focus:outline-hidden aria-selected:border-b-2 aria-selected:border-blue-500'

const HelperTabs: FC<HelperTabsProps> = ({ firstNightCharacters, otherNightCharacters, characters, onCharacterSelect }) => {
  const tabDefinitions: TabDefinition[] = [
    { value: HelperTab.FirstNight, label: '첫날밤', rows: firstNightCharacters },
    { value: HelperTab.OtherNight, label: '다른 밤', rows: otherNightCharacters },
    { value: HelperTab.Characters, label: '캐릭터', rows: characters },
  ]

  return (
    <Tabs defaultValue={HelperTab.FirstNight} className="w-full">
      <TabsList className="flex space-x-2 border-b border-gray-200 mb-4">
        {TAB_DEFINITIONS.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} className={tabTriggerClassName}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabDefinitions.map(tab => (
        <TabsContent key={tab.value} value={tab.value} className="w-full bg-white rounded-lg shadow-sm">
          {tab.rows.map(character => (
            <CharacterRow key={character.id} type={tab.value} character={character} onClick={onCharacterSelect} />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default HelperTabs
