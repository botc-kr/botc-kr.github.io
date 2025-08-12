import { Script } from '@/types/types'
import React, { useEffect, useState } from 'react'
import { fetchScripts, handleCopyJson, handleDownloadJson, handleDownloadPdf } from '@/utils/ScriptUtils'
import { Footer, Header } from '@/components/HeaderFooter'
import ScriptCategory from '@/components/ScriptCategory'
import { type PageType } from '@/constants/pages'
import { SECTIONS } from '@/constants/sections'

interface ScriptListProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
}

const ScriptList: React.FC<ScriptListProps> = ({ currentPage, onPageChange }) => {
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    fetchScripts(setScripts, setLoading)
  }, [])

  useEffect(() => {
    const scrollToScript = () => {
      const hash = window.location.hash.slice(1)
      if (!hash) return

      if (!loading && scripts.length > 0) {
        const element = document.getElementById(hash)
        if (element) {
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }
      }
    }

    scrollToScript()
    window.addEventListener('hashchange', scrollToScript)

    return () => window.removeEventListener('hashchange', scrollToScript)
  }, [loading, scripts])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  const officialScripts = scripts.filter(script => script.official)
  const teensyvilleScripts = scripts.filter(script => !script.official && script.teensyville)
  const communityScripts = scripts.filter(script => !script.official && !script.teensyville)

  const onCopyJson = async (jsonUrl: string, scriptId: string): Promise<void> => {
    await handleCopyJson(jsonUrl, scriptId, setCopiedId)
  }

  const onDownloadJson = async (jsonUrl: string, scriptId: string): Promise<void> => {
    await handleDownloadJson(jsonUrl, scriptId)
  }

  const onDownloadSheet = async (pdfUrl: string, scriptId: string): Promise<void> => {
    await handleDownloadPdf(pdfUrl, scriptId, setDownloadingId)
  }

  return (
    <>
      <Header currentPage={currentPage} onPageChange={onPageChange} />
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {officialScripts.length > 0 && (
          <div id={SECTIONS.OFFICIAL}>
            <ScriptCategory
              title="공식 스크립트"
              scripts={officialScripts}
              onCopyJson={onCopyJson}
              onDownloadJson={onDownloadJson}
              onDownloadSheet={onDownloadSheet}
              copiedId={copiedId}
              downloadingId={downloadingId}
            />
          </div>
        )}

        {communityScripts.length > 0 && (
          <div id={SECTIONS.COMMUNITY}>
            <ScriptCategory
              title="커스텀 스크립트"
              scripts={communityScripts}
              onCopyJson={onCopyJson}
              onDownloadJson={onDownloadJson}
              onDownloadSheet={onDownloadSheet}
              copiedId={copiedId}
              downloadingId={downloadingId}
            />
          </div>
        )}

        {teensyvilleScripts.length > 0 && (
          <div id={SECTIONS.TEENSYVILLE}>
            <ScriptCategory
              title="틴시빌 스크립트"
              scripts={teensyvilleScripts}
              onCopyJson={onCopyJson}
              onDownloadJson={onDownloadJson}
              onDownloadSheet={onDownloadSheet}
              copiedId={copiedId}
              downloadingId={downloadingId}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default ScriptList
