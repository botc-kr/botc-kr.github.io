export type Alignment = 'good' | 'evil'
export type Team = 'townsfolk' | 'outsider' | 'minion' | 'demon' | 'traveler'

export interface Role {
    id: string
    name: string
    team: Team
}

export interface Player {
    name: string
    role: string
    id: string
    isDead: boolean
    alignmentIndex: number // 0 usually? Need to verify if this tracks alignment changes
    roleName?: string
    roleImage?: string
    reminders: {
        role: string
        name: string
        image: string
    }[]
    // ... add other fields as needed from the log
}

export interface GameEdition {
    id: string
    name: string
}

export interface RawGameLog {
    edition: GameEdition
    players: Player[]
    bluffs: string[]
    roles: any[] // We might not need the full role definitions if we have a separate source or just use IDs
    npcs?: { id: string }[]
}

export interface GameLog extends RawGameLog {
    // Computed fields
    date: string // YYYY-MM-DD from filename
    winner: Alignment
    id: string // unique ID (filename)
}
