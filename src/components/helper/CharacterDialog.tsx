import { FC, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronLeft, X } from 'lucide-react'
import { Alignment, ALL_TEAM, Character, HelperInfo, Team } from '@/types/types'
import { ALL_GENERIC_INFO } from '@/constants/nightInfo'

type CharacterDialogProps = {
  character: Character
  script: Character[]
  genericInfos: Record<string, HelperInfo>
}

const allCharacterInfos: Record<string, HelperInfo[]> = {
  demon_info: [ALL_GENERIC_INFO.theseareyourminions, ALL_GENERIC_INFO.notinplay],
  poisoner: [
    {
      title: '매일 밤',
      message: '선택한 참가자는 내일 낮까지 중독됩니다.',
    },
  ],
  washerwoman: [
    {
      title: '매일 밤',
      message: '다음 두 참가자 중 하나는 다음 직업입니다.',
      teams: [Team.Townsfolk],
      count: 1,
    },
  ],
  librarian: [
    {
      title: '매일 밤',
      message: '다음 두 참가자 중 하나는 다음 직업입니다.',
      teams: [Team.Outsider],
      count: 1,
    },
  ],
  investigator: [
    {
      title: '매일 밤',
      message: '다음 두 참가자 중 하나는 다음 직업입니다.',
      teams: [Team.Minion],
      count: 1,
    },
  ],
  chef: [
    {
      title: '매일 밤',
      message: '인접해서 앉은 악한 참가자 쌍의 수',
    },
  ],
  empath: [
    {
      title: '매일 밤',
      message: '당신의 살아있는 이웃 중 악한 참가자의 수',
    },
  ],
  fortuneteller: [
    {
      title: '매일 밤',
      message: '두 참가자를 선택하세요.',
    },
  ],
  butler: [
    {
      title: '매일 밤',
      message: '당신을 제외한 참가자 한 명을 선택하세요. 그 사람이 투표해야만 당신도 투표할 수 있습니다.',
    },
    {
      title: '무단 투표한 경우',
      message: '주인님 허락 없이 투표하셨네요. 다음엔 그러지 마세요.',
    },
  ],
  monk: [
    {
      title: '매일 밤',
      message: '당신을 제외한 선택된 참가자는 악마로부터 안전합니다.',
    },
  ],
  imp: [
    {
      title: '매일 밤',
      message: '죽일 사람을 선택하세요. 자결한다면 다른 하수인이 임프가 됩니다.',
    },
  ],
  ravenkeeper: [
    {
      title: '악마에 의해 밤에 죽었다면',
      message: '선택한 참가자의 캐릭터를 알려드립니다.',
    },
  ],
  undertaker: [
    {
      title: '매일 밤',
      message: '오늘 낮에 처형 당한 사람의 직업은',
      teams: ALL_TEAM,
      count: 1,
    },
  ],
  philosopher: [
    {
      title: '게임 중 한 번',
      message: '능력을 사용하시겠습니까?',
    },
    {
      title: '능력을 사용한다면',
      message: '선한 캐릭터를 선택하세요. 플레이 중인 캐릭터라면 취합니다.',
      teams: [Team.Townsfolk, Team.Outsider],
      count: 1,
    },
  ],
  snakecharmer: [
    {
      title: '매일 밤',
      message: '참가자를 선택하세요. 만약 악마를 선택했다면 캐릭터와 진영이 바뀝니다.',
    },
    {
      title: '악마를 선택했다면',
      message: '당신은 이제부터 {character}이고, {alignment}입니다.',
      teams: [Team.Demon],
      count: 1,
      isAlignment: true,
    },
  ],
  cerenovus: [
    {
      title: '매일 밤',
      message: '참가자와 선한 직업을 선택하세요. 그 사람은 내일 그 직업이라는 `광기`에 빠집니다.',
    },
    {
      title: '광기 알려주기',
      message: `세레노부스가 당신을 선택했습니다. 내일부터 자신이 {character}라고 다른 사람들을 광적으로 설득해야 합니다.`,
      teams: [Team.Townsfolk, Team.Outsider],
      count: 1,
    },
  ],
  witch: [
    {
      title: '매일 밤',
      message: '참가자 한 명을 선택하세요. 다음날 그 사람이 지명하면 죽습니다.',
    },
  ],
  eviltwin: [
    {
      title: '첫날 밤',
      message: '당신의 선한 쌍둥이의 직업입니다.',
      teams: [Team.Townsfolk, Team.Outsider, Team.Minion],
      count: 1,
    },
  ],
  devilsadvocate: [
    {
      title: '매일 밤',
      message: '어제와 다른 참가자 한 명을 선택하세요. 그 사람은 처형으로 죽지 않습니다.',
    },
  ],
  grandmother: [
    {
      title: '첫날 밤',
      message: '당신의 손주는 {character} 입니다.',
      teams: [Team.Townsfolk, Team.Outsider],
      count: 1,
    },
  ],
  clockmaker: [
    {
      title: '첫날 밤',
      message: '악마와 가장 가까운 하수인의 거리 (바로 옆은 1)',
    },
  ],
  gambler: [
    {
      title: '매일 밤*',
      message: '참가자 한 명과 그의 직업을 추측하세요. (본인 가능) ',
      teams: [Team.Townsfolk, Team.Outsider, Team.Minion, Team.Demon, Team.Traveler],
      count: 1,
    },
  ],
  assassin: [
    {
      title: '게임 중 한 번',
      message: '능력을 사용하시겠습니까?',
    },
    {
      title: '능력을 사용한다면',
      message: '암살하고 싶은 사람을 선택하세요',
    },
  ],
}

export const CharacterDialog: FC<CharacterDialogProps> = ({ character, script, genericInfos }) => {
  const contentRef = useRef<HTMLDivElement>(null)

  const [selectedInfo, setSelectedInfo] = useState<HelperInfo | null>(null)
  const [selectedCharacters, setSelectedCharacters] = useState<Set<string>>(new Set())
  const [selectedAlignment, setSelectedAlignment] = useState<Alignment>(Alignment.Good)

  const characterInfos = Object.entries(allCharacterInfos).find(([key]) => character.id.includes(key))?.[1] || []

  const firstSelectedCharacterName = () => {
    return selectedCharacters.size > 0
      ? `'${script.find(char => char.id === Array.from(selectedCharacters)[0])?.name}'`
      : ''
  }

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
      const currentSelection = Array.from(prev)
      const isAlreadySelected = currentSelection.includes(characterId)
      const maxCount = selectedInfo?.count ?? Infinity

      if (isAlreadySelected) {
        return new Set(currentSelection.filter(id => id !== characterId))
      }

      if (maxCount > 0) {
        if (currentSelection.length >= maxCount) {
          currentSelection.shift()
        }

        currentSelection.push(characterId)

        if (contentRef.current) {
          contentRef.current.scrollTo({ top: 0 })
        }

        return new Set(currentSelection)
      }

      return prev
    })
  }

  const renderSelectedCharacters = () => {
    const selectedChars = script.filter(char => selectedCharacters.has(char.id))

    return (
      <div className="mx-auto">
        {selectedChars.length === 0 ? (
          <div className="p-6 border-2 border-dashed rounded-lg bg-gray-50">
            <p className="text-gray-500 text-center text-base">{selectedInfo?.count}명의 캐릭터를 선택하세요</p>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            {selectedChars.map(char => (
              <button
                key={char.id}
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
    const eligibleCharacters = script.filter(char => selectedInfo?.teams?.includes(char.team as Team))

    return (
      <div className="grid grid-cols-3 gap-2">
        {eligibleCharacters.map(char => (
          <button
            key={char.id}
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
            onClick={() => setSelectedAlignment(Alignment.Good)}
            className={`p-4 rounded-lg border flex justify-center items-center ${
              selectedAlignment === Alignment.Good ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
            }`}>
            <span className="text-sm font-medium">선</span>
          </button>
          <button
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
      .replace(/{character}/g, firstSelectedCharacterName())
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
            <button onClick={handleBackClick} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
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
              <div
                key={index}
                onClick={() => handleInfoClick(info)}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <h3 className="font-semibold">{info.title}</h3>
              </div>
            ))}
            <h2 className="text-l font-bold text-gray-900">일반 정보</h2>
            {Object.entries(genericInfos).map(([key, info]) => (
              <div
                key={key}
                onClick={() => handleInfoClick(info)}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <h3 className="font-semibold">{info.title}</h3>
              </div>
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
