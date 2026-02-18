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
  teams?: Team[]
  count?: number
  isAlignment?: boolean
  isNumber?: boolean
  isText?: boolean
  isBoolean?: boolean
}

export type HelperScriptMeta = {
  id: '_meta'
  author: string
  background: string | null
  isOfficial: boolean
  name: string
}

export type HelperEntry = HelperScriptMeta | Character

export const isHelperScriptMeta = (item: HelperEntry): item is HelperScriptMeta => item.id === '_meta'

export const isCharacterEntry = (item: HelperEntry): item is Character => !isHelperScriptMeta(item)
