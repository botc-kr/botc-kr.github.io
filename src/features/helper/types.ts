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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const TEAM_VALUES: string[] = Object.values(Team)
const isTeam = (value: unknown): value is Team => typeof value === 'string' && TEAM_VALUES.includes(value)

export const isHelperScriptMeta = (item: unknown): item is HelperScriptMeta => {
  if (!isRecord(item)) {
    return false
  }

  return (
    item.id === '_meta' &&
    typeof item.author === 'string' &&
    (typeof item.background === 'string' || item.background === null) &&
    typeof item.isOfficial === 'boolean' &&
    typeof item.name === 'string'
  )
}

export const isCharacterEntry = (item: unknown): item is Character => {
  if (!isRecord(item)) {
    return false
  }

  return (
    typeof item.id === 'string' &&
    item.id !== '_meta' &&
    typeof item.name === 'string' &&
    typeof item.image === 'string' &&
    typeof item.firstNight === 'number' &&
    typeof item.firstNightReminder === 'string' &&
    typeof item.otherNight === 'number' &&
    typeof item.otherNightReminder === 'string' &&
    typeof item.ability === 'string' &&
    (item.team === undefined || isTeam(item.team))
  )
}

export const isHelperEntry = (item: unknown): item is HelperEntry => isHelperScriptMeta(item) || isCharacterEntry(item)
