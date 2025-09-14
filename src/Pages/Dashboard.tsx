import { Head, Link, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import StatsSection from '../components/Dashboard/StatsSection'
import MetricsSection from '../components/Dashboard/MetricsSection'
import RecentTodosSection from '../components/Dashboard/RecentTodosSection'

type Todo = {
  id: number
  title: string
  completed: number
}

type Props = {
  stats?: {
    total_todos: number
    completed_todos: number
    pending_todos: number
  }
  metrics?: {
    last_updated: string
    random_metric: number
    server_load: string
  }
  recent_todos?: Todo[]
}

export default function Dashboard({ stats, metrics, recent_todos }: Props) {
  const [autoRefreshMetrics, setAutoRefreshMetrics] = useState(false)
  const [loadingSection, setLoadingSection] = useState<string | null>(null)

  // Auto-refresh metrics every 3 seconds
  useEffect(() => {
    if (!autoRefreshMetrics) return

    const interval = setInterval(() => {
      setLoadingSection('metrics')
      router.reload({
        only: ['metrics'],
        onFinish: () => setLoadingSection(null),
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [autoRefreshMetrics])

  // Refresh everything
  const refreshAll = () => {
    setLoadingSection('all')
    router.reload({
      onFinish: () => setLoadingSection(null),
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Head title="Dashboard" />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard - Single Page Partial Reload Demo
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to Home
          </Link>
        </div>

        <StatsSection
          stats={stats}
          loadingSection={loadingSection}
          setLoadingSection={setLoadingSection}
        />

        <MetricsSection
          metrics={metrics}
          loadingSection={loadingSection}
          setLoadingSection={setLoadingSection}
          autoRefreshMetrics={autoRefreshMetrics}
          setAutoRefreshMetrics={setAutoRefreshMetrics}
        />

        <RecentTodosSection
          recent_todos={recent_todos}
          loadingSection={loadingSection}
          setLoadingSection={setLoadingSection}
        />

        {/* Combined Actions */}
        <div className="mb-8 p-4 bg-white rounded-lg border border-gray-200">
          <button
            onClick={refreshAll}
            disabled={loadingSection !== null}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            Refresh All Data
            {loadingSection === 'all' && <span className="ml-2">(Loading...)</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
