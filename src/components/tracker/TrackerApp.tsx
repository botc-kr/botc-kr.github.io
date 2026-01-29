import { useEffect, useState } from 'react'
import { fetchGameLogs } from './api'
import { GameLog } from './types'
import Dashboard from './Dashboard'

const TrackerApp = () => {
    const [logs, setLogs] = useState<GameLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            const data = await fetchGameLogs()
            // Sort by date desc
            // Sort by date desc, then by id desc (for same date)
            // Actually, id contains date, so sorting by id desc is sufficient
            const sorted = data.sort((a, b) => b.id.localeCompare(a.id))
            setLogs(sorted)
            setLoading(false)
        }
        loadData()
    }, [])

    if (loading) {
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

            <Dashboard logs={logs} />
        </div>
    )
}

export default TrackerApp
