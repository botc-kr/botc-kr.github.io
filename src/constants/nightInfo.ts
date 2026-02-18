import minion_info from '@/assets/images/minion_info.webp'
import demon_info from '@/assets/images/demon_info.webp'
import dusk from '@/assets/images/dusk.webp'
import dawn from '@/assets/images/dawn.webp'
import { Character, HelperInfo, Team } from '@/features/helper/types'

export const NIGHT_INFO: Character[] = [
  {
    id: 'dusk',
    name: '해질녘',
    firstNightReminder: '모두 눈을 감게하고, 일부 여행자 행동을 처리합니다.',
    firstNight: 1,
    image: dusk,
    ability: '',
    otherNight: 1,
    otherNightReminder: '모두 눈을 감게하고, 일부 여행자 행동을 처리합니다.',
    team: Team.Info,
  },
  {
    id: 'dawn',
    name: '새벽',
    firstNightReminder: '몇 초 기다린 후 모두 눈을 뜨게한 뒤, 사망자를 발표합니다.',
    firstNight: 99,
    image: dawn,
    ability: '',
    otherNight: 99,
    otherNightReminder: '몇 초 기다린 후 모두 눈을 뜨게한 뒤, 사망자를 발표합니다.',
    team: Team.Info,
  },
  {
    id: 'minion_info',
    name: '하수인 셋업',
    firstNightReminder: '하수인들을 깨워 악마를 알려주세요.',
    firstNight: 13,
    image: minion_info,
    ability: '',
    otherNight: 0,
    otherNightReminder: '',
    team: Team.Info,
  },
  {
    id: 'demon_info',
    name: '악마 셋업',
    firstNightReminder: '악마를 깨워 하수인들을 알려주고, 이번 게임에 참가하지 않는 선한 캐릭터 3개를 알려주세요.',
    firstNight: 17,
    image: demon_info,
    ability: '',
    otherNight: 0,
    otherNightReminder: '',
    team: Team.Info,
  },
] as const

export const ALL_GENERIC_INFO: Record<string, HelperInfo> = {
  youare: {
    title: '당신은',
    message: '당신은 {character} 입니다.',
    teams: [Team.Townsfolk, Team.Outsider, Team.Minion, Team.Demon],
    count: 1,
  },
  theyis: {
    title: '이 사람은',
    message: '이 사람은 {character} 입니다.',
    teams: [Team.Townsfolk, Team.Outsider, Team.Minion, Team.Demon],
    count: 1,
  },
  character: {
    title: '직업 토큰',
    message: '',
    teams: [Team.Townsfolk, Team.Outsider, Team.Minion, Team.Demon],
    count: 1,
  },
  alignment: {
    title: '진영',
    message: '당신은 이제부터 {alignment}입니다.',
    isAlignment: true,
  },
  number: {
    title: '숫자',
    message: '',
  },
  text: {
    title: '텍스트',
    message: '',
  },
  boolean: {
    title: '참/거짓',
    message: '',
  },
  thisisyourdemon: {
    title: '이 사람이 악마',
    message: '이 사람이 악마입니다',
  },
  theseareyourminions: {
    title: '이 사람들이 하수인',
    message: '이 사람들이 하수인입니다',
  },
  notinplay: {
    title: '블러핑 주기',
    message: '다음 3개 캐릭터는 이번 게임에 없습니다.',
    teams: [Team.Townsfolk, Team.Outsider],
    count: 3,
  },
  didyouvotetoday: {
    title: '오늘 투표했나요?',
    message: '오늘 투표했나요?',
  },
  didyounominatetoday: {
    title: '오늘 지명했나요?',
    message: '오늘 지명했나요?',
  },
  thischaracterselectedyou: {
    title: '이 캐릭터가 당신을 선택했습니다.',
    message: '이 캐릭터가 당신을 선택했습니다.',
    teams: [Team.Townsfolk, Team.Outsider, Team.Minion, Team.Demon],
    count: 1,
  },
} as const
