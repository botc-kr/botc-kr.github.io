import { useCallback, useEffect, useState } from 'react'
import { type PageType } from '@/constants/pages'
import { hashFromPageType, isPageRouteHash, pageTypeFromHash } from '@/constants/routes'
import { clearCurrentLocationHash } from '@/utils/location'
import { scrollToTop } from '@/utils/scroll'

const initialPageType = (): PageType => {
  if (typeof window === 'undefined') {
    return pageTypeFromHash('')
  }

  return pageTypeFromHash(window.location.hash)
}

export const useHashPageRoute = () => {
  const [currentPage, setCurrentPage] = useState<PageType>(initialPageType)

  const handlePageChange = useCallback((page: PageType): void => {
    if (typeof window === 'undefined') {
      setCurrentPage(page)
      return
    }

    scrollToTop()
    setCurrentPage(page)
    const nextHash = hashFromPageType(page)
    if (nextHash.length > 0) {
      window.location.hash = nextHash
      return
    }

    clearCurrentLocationHash()
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (!isPageRouteHash(hash)) {
        return
      }

      setCurrentPage(pageTypeFromHash(hash))
      scrollToTop()
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return {
    currentPage,
    handlePageChange,
  }
}
