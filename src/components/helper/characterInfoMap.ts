import { ALL_GENERIC_INFO } from '@/constants/nightInfo'
import { ALL_TEAM, HelperInfo, Team } from '@/features/helper/types'

export const CHARACTER_INFO_MAP: Record<string, HelperInfo[]> = {
  minion_info: [ALL_GENERIC_INFO.thisisyourdemon],
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
      message: '참가자 한 명을 선택하세요. 그 사람은 오늘 밤 악마로부터 안전합니다.',
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
  godfather: [
    {
      title: '첫날 밤',
      message: '다음 이방인들이 게임에 참가중입니다.',
      teams: [Team.Outsider],
      count: 3,
    },
    {
      title: '이방인이 죽었다면',
      message: '죽이고 싶은 참가자를 선택하세요.',
    },
  ],
  seamstress: [
    {
      title: '게임 중 한 번',
      message: '능력을 사용하시겠습니까?',
    },
    {
      title: '능력을 사용한다면',
      message: '참가자 2명을 선택하세요. 그 사람들이 같은 팀인지 알려드립니다.',
    },
  ],
  exorcist: [
    {
      title: '매일 밤',
      message: '어제와 다른 참가자를 선택하세요.',
    },
  ],
  pukka: [
    {
      title: '매일 밤',
      message: '중독시킬 사람을 선택하세요. 이전에 중독되었던 사람은 죽고, 중독이 풀립니다.',
    },
  ],
}

export const getCharacterInfos = (characterId: string): HelperInfo[] => {
  for (const [roleId, infos] of Object.entries(CHARACTER_INFO_MAP)) {
    if (characterId.includes(roleId)) {
      return infos
    }
  }
  return []
}
