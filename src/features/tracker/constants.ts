import type { Alignment } from '@/features/tracker/types'

export const WINNER_COLORS = {
  good: '#0088FE',
  evil: '#FF8042',
} as const

export const WINNER_BADGE_CLASSES = {
  good: 'bg-blue-100 text-blue-800',
  evil: 'bg-orange-100 text-orange-800',
} as const

export const winnerLabel = (winner: Alignment): string => winner.toUpperCase()
