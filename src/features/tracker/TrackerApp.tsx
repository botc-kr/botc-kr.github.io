import { LoadingState } from '@/components/AsyncState'
import { Header } from '@/components/layout/Header'
import type { PageType } from '@/constants/pages'
import Dashboard from '@/features/tracker/Dashboard'
import { useGameLogs } from '@/features/tracker/hooks/useGameLogs'

interface TrackerAppProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
}

const TrackerApp = ({ currentPage, onPageChange }: TrackerAppProps) => {
  const { gameLogs, isLoading } = useGameLogs()

  if (isLoading) {
    return (
      <>
        <Header currentPage={currentPage} onPageChange={onPageChange} />
        <LoadingState className="min-h-[60vh]" message="" showSpinner />
      </>
    )
  }

  return (
    <>
      <Header currentPage={currentPage} onPageChange={onPageChange} />
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blood on the Clocktower Tracker</h1>
          <p className="text-gray-500 mt-2">Game history and statistics</p>
        </header>

        <Dashboard logs={gameLogs} />
      </div>
    </>
  )
}

export default TrackerApp
