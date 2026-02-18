import { type FC, useCallback, useMemo } from 'react'
import { LoadingState } from '@/components/AsyncState'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import type { Script } from '@/features/scripts/types'
import { buildScriptCategories } from '@/features/scripts/services/scriptCategoryService'
import { fetchScripts } from '@/features/scripts/services/scriptService'
import ScriptCategory from '@/features/scripts/components/ScriptCategory'
import { useScrollToScriptHash } from '@/features/scripts/hooks/useScrollToScriptHash'
import { useScriptActions } from '@/features/scripts/hooks/useScriptActions'
import { type PageType } from '@/constants/pages'
import { useAsyncData } from '@/hooks/useAsyncData'
import { notify } from '@/lib/utils'

interface ScriptListProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
}

const ScriptList: FC<ScriptListProps> = ({ currentPage, onPageChange }) => {
  const handleLoadScriptsError = useCallback((error: unknown): void => {
    console.error('Error loading scripts:', error)
    notify('스크립트 데이터를 불러오지 못했습니다.')
  }, [])

  const { data: scripts, isLoading } = useAsyncData<Script[]>(fetchScripts, [], {
    onError: handleLoadScriptsError,
  })
  const { copiedId, downloadingId, onCopyJson, onDownloadJson, onDownloadPdf } = useScriptActions()
  useScrollToScriptHash(!isLoading && scripts.length > 0)

  const scriptCategories = useMemo(() => buildScriptCategories(scripts), [scripts])

  if (isLoading) {
    return <LoadingState className="min-h-screen" />
  }

  return (
    <>
      <Header currentPage={currentPage} onPageChange={onPageChange} />
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {scriptCategories
          .filter(category => category.scripts.length > 0)
          .map(category => (
            <div key={category.id} id={category.id}>
              <ScriptCategory
                title={category.title}
                scripts={category.scripts}
                onCopyJson={onCopyJson}
                onDownloadJson={onDownloadJson}
                onDownloadPdf={onDownloadPdf}
                copiedId={copiedId}
                downloadingId={downloadingId}
              />
            </div>
          ))}
      </div>
      <Footer />
    </>
  )
}

export default ScriptList
