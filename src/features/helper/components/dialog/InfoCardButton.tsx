import type { FC } from 'react'
import { HelperInfo } from '@/features/helper/types'

interface InfoCardButtonProps {
  info: HelperInfo
  onSelect: (info: HelperInfo) => void
}

export const InfoCardButton: FC<InfoCardButtonProps> = ({ info, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(info)}
    className="w-full p-4 border rounded-lg text-left hover:bg-gray-50">
    <h3 className="font-semibold">{info.title}</h3>
  </button>
)
