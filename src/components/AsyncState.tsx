import type { FC } from 'react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  className?: string
  message?: string
  showSpinner?: boolean
}

interface ErrorStateProps {
  className?: string
  message: string
}

export const LoadingState: FC<LoadingStateProps> = ({ className, message = 'Loading...', showSpinner = false }) => (
  <div className={cn('flex items-center justify-center', className)}>
    {showSpinner ? (
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        {message ? <span>{message}</span> : null}
      </div>
    ) : (
      <span>{message}</span>
    )}
  </div>
)

export const ErrorState: FC<ErrorStateProps> = ({ className, message }) => (
  <div className={cn('flex items-center justify-center text-red-500', className)}>
    <span>{message}</span>
  </div>
)
