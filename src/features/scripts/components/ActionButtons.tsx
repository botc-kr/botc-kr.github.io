import { ActionButtonsProps } from '@/features/scripts/types'
import { useTransientValue } from '@/hooks/useTransientValue'
import { Check, Copy, Download, Share2 } from 'lucide-react'
import { type FC, type ReactNode } from 'react'
import { copyTextToClipboard, isClipboardAvailable } from '@/utils/clipboard'
import { buildCurrentPathUrlWithHash } from '@/utils/location'

interface GradientButtonProps {
  className: string
  onClick: () => void
  disabled?: boolean
  icon?: ReactNode
  label: string
}

const buttonBaseStyle =
  'inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg shadow-xs transition-all duration-200 font-medium'
const SHARED_LABEL_DURATION_MS = 2000

const GradientButton: FC<GradientButtonProps> = ({ className, onClick, disabled = false, icon, label }) => (
  <button type="button" onClick={onClick} disabled={disabled} className={`${buttonBaseStyle} ${className}`}>
    {icon}
    <span className="whitespace-nowrap">{label}</span>
  </button>
)

const ActionButtons: FC<ActionButtonsProps> = ({
  script,
  onCopyJson,
  onDownloadJson,
  onDownloadPdf,
  copiedId,
  downloadingId,
}) => {
  const canUseClipboard = isClipboardAvailable()
  const { value: sharedState, show: showShared } = useTransientValue<boolean>(SHARED_LABEL_DURATION_MS)

  const handleShare = async (): Promise<void> => {
    try {
      const shareUrl = buildCurrentPathUrlWithHash(script.id)
      await copyTextToClipboard(shareUrl)
      showShared(true)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const isCopied = copiedId === script.id
  const isDownloadingPdf = downloadingId === script.id
  const isSharedCopied = sharedState === true

  return (
    <div className="flex gap-2 sm:gap-3">
      {canUseClipboard && (
        <GradientButton
          onClick={() => onCopyJson(script.json, script.id)}
          className={`${
            isCopied ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-teal-500 to-emerald-500'
          } text-white hover:from-teal-600 hover:to-emerald-600 hover:shadow-md active:scale-95`}
          icon={isCopied ? <Check size={16} className="shrink-0" /> : <Copy size={16} className="shrink-0" />}
          label={isCopied ? '복사됨' : '복사'}
        />
      )}
      <GradientButton
        onClick={() => onDownloadPdf(script.pdf, script.id)}
        disabled={isDownloadingPdf}
        className="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
        icon={isDownloadingPdf ? undefined : <Download size={16} className="shrink-0" />}
        label={isDownloadingPdf ? '다운로드 중...' : '시트'}
      />
      <GradientButton
        onClick={() => onDownloadJson(script.json, script.id)}
        className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 hover:shadow-md active:scale-95"
        icon={<Download size={16} className="shrink-0" />}
        label="JSON"
      />
      <GradientButton
        onClick={() => {
          void handleShare()
        }}
        disabled={!canUseClipboard}
        className={`${
          isSharedCopied ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-violet-500 to-purple-500'
        } text-white hover:from-violet-600 hover:to-purple-600 hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100`}
        icon={isSharedCopied ? <Check size={16} className="shrink-0" /> : <Share2 size={16} className="shrink-0" />}
        label={isSharedCopied ? '복사됨' : '공유'}
      />
    </div>
  )
}

export default ActionButtons
