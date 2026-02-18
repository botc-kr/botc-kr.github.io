export interface Script {
  id: string
  official: boolean
  teensyville: boolean
  synopsis: string
  logo: string
  name: string
  author: string
  note: string
  json: string
  pdf: string
}

export interface ScriptCategoryProps {
  title: string
  scripts: Script[]
  onCopyJson: (json: string, id: string) => void
  onDownloadJson: (json: string, id: string) => void
  onDownloadSheet: (pdf: string, id: string) => void
  copiedId: string | null
  downloadingId: string | null
}

export interface ActionButtonsProps {
  script: Script
  onCopyJson: (json: string, id: string) => void
  onDownloadJson: (json: string, id: string) => void
  onDownloadSheet: (pdf: string, id: string) => void
  copiedId: string | null
  downloadingId: string | null
}

// PageType is defined in src/constants/pages.ts

export enum Team {
  Townsfolk = 'townsfolk',
  Outsider = 'outsider',
  Minion = 'minion',
  Demon = 'demon',
  Traveler = 'traveler',
  Info = 'info',
}

export enum Alignment {
  Good = 'good',
  Evil = 'evil',
}

export const ALL_TEAM: Team[] = [Team.Townsfolk, Team.Outsider, Team.Minion, Team.Demon]

export type Character = {
  id: string
  name: string
  image: string
  firstNight: number
  firstNightReminder: string
  otherNight: number
  otherNightReminder: string
  ability: string
  team?: Team
}

export enum HelperTab {
  FirstNight = 'firstNight',
  OtherNight = 'otherNight',
  Characters = 'characters',
}

export type HelperInfo = {
  title: string
  message: string
  teams?: Team[] // 선택 가능한 캐릭터들의 팀 목록
  count?: number // 선택 가능한 캐릭터들의 수
  isAlignment?: boolean
  isNumber?: boolean
  isText?: boolean
  isBoolean?: boolean
}

export type ScriptData = {
  author: string
  background: null
  id: string
  isOfficial: boolean
  name: string
}
