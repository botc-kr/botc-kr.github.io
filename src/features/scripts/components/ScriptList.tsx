import { type FC, useMemo } from 'react'
import { LoadingState } from '@/components/AsyncState'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { buildScriptCategories } from '@/features/scripts/services/scriptCategoryService'
import ScriptCategory from '@/features/scripts/components/ScriptCategory'
import { useScrollToScriptHash } from '@/features/scripts/hooks/useScrollToScriptHash'
import { useScriptActions } from '@/features/scripts/hooks/useScriptActions'
import { useScripts } from '@/features/scripts/hooks/useScripts'
import { type PageType } from '@/constants/pages'

interface ScriptListProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
}

const ScriptList: FC<ScriptListProps> = ({ currentPage, onPageChange }) => {
  const { scripts, isLoading } = useScripts()
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
