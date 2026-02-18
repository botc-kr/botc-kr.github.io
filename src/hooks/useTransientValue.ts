import { useCallback, useEffect, useRef, useState } from 'react'

interface UseTransientValueReturn<T> {
  value: T | null
  show: (nextValue: T) => void
  clear: () => void
}

export const useTransientValue = <T>(durationMs: number): UseTransientValueReturn<T> => {
  const [value, setValue] = useState<T | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const clearTimeoutIfNeeded = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const clear = useCallback(() => {
    clearTimeoutIfNeeded()
    setValue(null)
  }, [clearTimeoutIfNeeded])

  const show = useCallback(
    (nextValue: T) => {
      setValue(nextValue)
      clearTimeoutIfNeeded()

      timeoutRef.current = window.setTimeout(() => {
        setValue(currentValue => (currentValue === nextValue ? null : currentValue))
        timeoutRef.current = null
      }, durationMs)
    },
    [clearTimeoutIfNeeded, durationMs],
  )

  useEffect(() => clear, [clear])

  return { value, show, clear }
}
