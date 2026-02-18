import React, { useCallback, useEffect, useMemo } from 'react'
import { LoadingState } from '@/components/AsyncState'
import type { Script } from '@/features/scripts/types'
import { fetchScripts } from '@/features/scripts/services/scriptService'
import { Footer, Header } from '@/components/HeaderFooter'
import ScriptCategory from '@/features/scripts/components/ScriptCategory'
import { useScriptActions } from '@/features/scripts/hooks/useScriptActions'
import { type PageType } from '@/constants/pages'
import { SECTIONS } from '@/constants/sections'
import { HEADER_OFFSET_PX } from '@/constants/ui'
import { useAsyncData } from '@/hooks/useAsyncData'
import { notify } from '@/lib/utils'
import { scrollToElementById } from '@/utils/scroll'

interface ScriptListProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
}

const ScriptList: React.FC<ScriptListProps> = ({ currentPage, onPageChange }) => {
  const handleLoadScriptsError = useCallback((error: unknown): void => {
    console.error('Error loading scripts:', error)
    notify('스크립트 데이터를 불러오지 못했습니다.')
  }, [])

  const { data: scripts, isLoading } = useAsyncData<Script[]>(fetchScripts, [], {
    onError: handleLoadScriptsError,
  })
  const { copiedId, downloadingId, onCopyJson, onDownloadJson, onDownloadPdf } = useScriptActions()

  useEffect(() => {
    const scrollToScript = () => {
      const hash = window.location.hash.slice(1)
      if (!hash) return

      if (!isLoading && scripts.length > 0) {
        scrollToElementById(hash, HEADER_OFFSET_PX)
      }
    }

    scrollToScript()
    window.addEventListener('hashchange', scrollToScript)

    return () => window.removeEventListener('hashchange', scrollToScript)
  }, [isLoading, scripts])

  const scriptCategories = useMemo(() => {
    const officialScripts = scripts.filter(script => script.official)
    const teensyvilleScripts = scripts.filter(script => !script.official && script.teensyville)
    const communityScripts = scripts.filter(script => !script.official && !script.teensyville)

    return [
      { id: SECTIONS.OFFICIAL, title: '공식 스크립트', scripts: officialScripts },
      { id: SECTIONS.COMMUNITY, title: '커스텀 스크립트', scripts: communityScripts },
      { id: SECTIONS.TEENSYVILLE, title: '틴시빌 스크립트', scripts: teensyvilleScripts },
    ]
  }, [scripts])

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
