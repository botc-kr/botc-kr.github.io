import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Script } from '@/features/scripts/types'
import {
  copyScriptJsonToClipboard,
  downloadScriptJson,
  downloadScriptPdf,
  fetchScripts,
} from '@/features/scripts/services/scriptService'
import { Footer, Header } from '@/components/HeaderFooter'
import ScriptCategory from '@/features/scripts/components/ScriptCategory'
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

  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  const onCopyJson = async (jsonUrl: string, scriptId: string): Promise<void> => {
    try {
      await copyScriptJsonToClipboard(jsonUrl)
      setCopiedId(scriptId)
      window.setTimeout(() => {
        setCopiedId(null)
      }, 1000)
    } catch (error) {
      console.error('Error copying JSON:', error)
      notify('JSON 복사 중 오류가 발생했습니다.')
    }
  }

  const onDownloadJson = async (jsonUrl: string, scriptId: string): Promise<void> => {
    try {
      await downloadScriptJson(jsonUrl, scriptId)
    } catch (error) {
      console.error('Error downloading JSON:', error)
      notify('JSON 다운로드 중 오류가 발생했습니다.')
    }
  }

  const onDownloadPdf = async (pdfUrl: string, scriptId: string): Promise<void> => {
    try {
      setDownloadingId(scriptId)
      await downloadScriptPdf(pdfUrl)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      notify('PDF 다운로드 중 오류가 발생했습니다.')
    } finally {
      setDownloadingId(null)
    }
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
