import { lazy, Suspense, useEffect, useState } from 'react'
import { Footer } from '@/components/HeaderFooter'
import { PAGE_TYPES, type PageType } from '@/constants/pages'
import { pageTypeFromHash, hashFromPageType } from '@/constants/routes'
import { scrollToTop } from '@/utils/scroll'

const SavantProposition = lazy(() => import('@/components/SavantProposition'))
const ScriptList = lazy(() => import('@/features/scripts/components/ScriptList'))
const Helper = lazy(() => import('@/features/helper/components/Helper'))
const TrackerApp = lazy(() => import('@/features/tracker/TrackerApp'))

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>(() => pageTypeFromHash(window.location.hash))

  const handlePageChange = (page: PageType) => {
    scrollToTop()
    setCurrentPage(page)
    window.location.hash = hashFromPageType(page)
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      const page = pageTypeFromHash(hash)
      setCurrentPage(page)
      scrollToTop()
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
        {currentPage === PAGE_TYPES.SCRIPTS ? (
          <ScriptList currentPage={currentPage} onPageChange={handlePageChange} />
        ) : currentPage === PAGE_TYPES.HELPER ? (
          <Helper />
        ) : currentPage === PAGE_TYPES.TRACKER ? (
          <TrackerApp />
        ) : (
          <>
            <SavantProposition currentPage={currentPage} onPageChange={handlePageChange} />
            <Footer />
          </>
        )}
      </Suspense>
    </div>
  )
}

export default App
