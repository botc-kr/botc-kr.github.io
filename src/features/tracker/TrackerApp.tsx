import { LoadingState } from '@/components/AsyncState'
import Dashboard from '@/features/tracker/Dashboard'
import { useGameLogs } from '@/features/tracker/hooks/useGameLogs'

const TrackerApp = () => {
  const { gameLogs, isLoading } = useGameLogs()

  if (isLoading) {
    return <LoadingState className="min-h-screen" message="" showSpinner />
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blood on the Clocktower Tracker</h1>
        <p className="text-gray-500 mt-2">Game history and statistics</p>
      </header>

      <Dashboard logs={gameLogs} />
    </div>
  )
}

export default TrackerApp
