import type { FC } from 'react'
import { Alignment } from '@/features/helper/types'

interface AlignmentSelectorProps {
  selectedAlignment: Alignment
  onSelectAlignment: (alignment: Alignment) => void
}

const getAlignmentButtonClassName = (isSelected: boolean): string =>
  `p-4 rounded-lg border flex justify-center items-center ${
    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
  }`

export const AlignmentSelector: FC<AlignmentSelectorProps> = ({ selectedAlignment, onSelectAlignment }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold text-gray-900">진영 선택</h3>
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onSelectAlignment(Alignment.Good)}
        className={getAlignmentButtonClassName(selectedAlignment === Alignment.Good)}>
        <span className="text-sm font-medium">선</span>
      </button>
      <button
        type="button"
        onClick={() => onSelectAlignment(Alignment.Evil)}
        className={getAlignmentButtonClassName(selectedAlignment === Alignment.Evil)}>
        <span className="text-sm font-medium">악</span>
      </button>
    </div>
  </div>
)
