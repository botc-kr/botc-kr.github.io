import { useEffect } from 'react'
import { HEADER_OFFSET_PX } from '@/constants/ui'
import { scrollToElementById } from '@/utils/scroll'

export const useScrollToScriptHash = (isEnabled: boolean): void => {
  useEffect(() => {
    const scrollToScript = (): void => {
      const hash = window.location.hash.slice(1)
      if (!hash || !isEnabled) {
        return
      }

      scrollToElementById(hash, HEADER_OFFSET_PX)
    }

    scrollToScript()
    window.addEventListener('hashchange', scrollToScript)

    return () => window.removeEventListener('hashchange', scrollToScript)
  }, [isEnabled])
}
