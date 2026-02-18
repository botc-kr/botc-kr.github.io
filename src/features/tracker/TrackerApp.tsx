import { useCallback } from 'react'
import Dashboard from '@/features/tracker/Dashboard'
import { fetchGameLogs } from '@/features/tracker/api'
import { GameLog } from '@/features/tracker/types'
import { useAsyncData } from '@/hooks/useAsyncData'

const sortLogsByIdDesc = (logs: GameLog[]): GameLog[] =>
  [...logs].sort((left, right) => right.id.localeCompare(left.id))

const TrackerApp = () => {
  const loadGameLogs = useCallback(async (): Promise<GameLog[]> => sortLogsByIdDesc(await fetchGameLogs()), [])
  const { data: gameLogs, isLoading } = useAsyncData<GameLog[]>(loadGameLogs, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
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
