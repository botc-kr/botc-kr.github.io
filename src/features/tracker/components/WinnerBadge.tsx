import type { FC } from 'react'
import type { Alignment } from '@/features/tracker/types'
import { WINNER_BADGE_CLASSES, winnerLabel } from '@/features/tracker/constants'

interface WinnerBadgeProps {
  winner: Alignment
}

const WinnerBadge: FC<WinnerBadgeProps> = ({ winner }) => (
  <span className={`px-2 py-1 rounded-sm text-xs font-semibold ${WINNER_BADGE_CLASSES[winner]}`}>
    {winnerLabel(winner)}
  </span>
)

export default WinnerBadge
