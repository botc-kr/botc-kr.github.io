export type Alignment = 'good' | 'evil'
export type Team = 'townsfolk' | 'outsider' | 'minion' | 'demon' | 'traveler'

export interface Role {
  id: string
  name: string
  team: Team
}

export interface Reminder {
  role: string
  name: string
  image?: string
  imageAlt?: string
}

export interface Player {
  name: string
  role: string
  id: string
  isDead: boolean
  alignmentIndex: number
  roleName?: string
  roleImage?: string
  reminders: Reminder[]
  [key: string]: unknown
}

export interface GameEdition {
  id: string
  name: string
  author?: string
  isOfficial?: boolean
}

export interface RoleDefinition {
  id?: string
  name?: string
  image?: string
  team?: Team
  '0'?: string
  '1'?: string
  '2'?: string
  '12'?: Team
  [key: string]: unknown
}

export interface RawGameLog {
  edition: GameEdition
  players: Player[]
  bluffs: string[]
  roles?: RoleDefinition[]
  npcs?: { id: string }[]
}

export interface GameLog extends RawGameLog {
  date: string
  winner: Alignment
  id: string
}

export interface WinRateDataItem {
  name: string
  value: number
}

export interface RecentGameWinnerData {
  name: string
  value: number
  winner: Alignment
}
