import { lazy, Suspense } from 'react'
import { LoadingState } from '@/components/AsyncState'
import { Footer } from '@/components/layout/Footer'
import { PAGE_TYPES } from '@/constants/pages'
import { useHashPageRoute } from '@/hooks/useHashPageRoute'

const SavantProposition = lazy(() => import('@/components/SavantProposition'))
const ScriptList = lazy(() => import('@/features/scripts/components/ScriptList'))
const Helper = lazy(() => import('@/features/helper/components/Helper'))
const TrackerApp = lazy(() => import('@/features/tracker/TrackerApp'))

function App() {
  const { currentPage, handlePageChange } = useHashPageRoute()

  const renderCurrentPage = () => {
    switch (currentPage) {
      case PAGE_TYPES.SCRIPTS:
        return <ScriptList currentPage={currentPage} onPageChange={handlePageChange} />
      case PAGE_TYPES.HELPER:
        return <Helper currentPage={currentPage} onPageChange={handlePageChange} />
      case PAGE_TYPES.TRACKER:
        return <TrackerApp />
      case PAGE_TYPES.SAVANT:
      default:
        return (
          <>
            <SavantProposition currentPage={currentPage} onPageChange={handlePageChange} />
            <Footer />
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingState className="min-h-screen" />}>
        {renderCurrentPage()}
      </Suspense>
    </div>
  )
}

export default App
