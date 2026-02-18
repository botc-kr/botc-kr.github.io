import { useCallback, useEffect, useRef, useState } from 'react'
import { copyScriptJsonToClipboard, downloadScriptJson, downloadScriptPdf } from '@/features/scripts/services/scriptService'
import { notify } from '@/lib/utils'

const COPIED_LABEL_DURATION_MS = 1000

type ScriptAction = () => Promise<void>

const runScriptAction = async (
  action: ScriptAction,
  contextLabel: string,
  notifyMessage: string,
): Promise<boolean> => {
  try {
    await action()
    return true
  } catch (error) {
    console.error(`Error during ${contextLabel}:`, error)
    notify(notifyMessage)
    return false
  }
}

export const useScriptActions = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const clearCopiedLabelTimeoutRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (clearCopiedLabelTimeoutRef.current !== null) {
        window.clearTimeout(clearCopiedLabelTimeoutRef.current)
      }
    },
    [],
  )

  const setCopiedLabel = useCallback((scriptId: string) => {
    setCopiedId(scriptId)

    if (clearCopiedLabelTimeoutRef.current !== null) {
      window.clearTimeout(clearCopiedLabelTimeoutRef.current)
    }

    clearCopiedLabelTimeoutRef.current = window.setTimeout(() => {
      setCopiedId(currentCopiedId => (currentCopiedId === scriptId ? null : currentCopiedId))
    }, COPIED_LABEL_DURATION_MS)
  }, [])

  const onCopyJson = useCallback(
    async (jsonUrl: string, scriptId: string): Promise<void> => {
      const success = await runScriptAction(
        async () => {
          await copyScriptJsonToClipboard(jsonUrl)
          setCopiedLabel(scriptId)
        },
        'copying JSON',
        'JSON 복사 중 오류가 발생했습니다.',
      )

      if (!success) {
        setCopiedId(null)
      }
    },
    [setCopiedLabel],
  )

  const onDownloadJson = useCallback(async (jsonUrl: string, scriptId: string): Promise<void> => {
    await runScriptAction(
      () => downloadScriptJson(jsonUrl, scriptId),
      'downloading JSON',
      'JSON 다운로드 중 오류가 발생했습니다.',
    )
  }, [])

  const onDownloadPdf = useCallback(async (pdfUrl: string, scriptId: string): Promise<void> => {
    setDownloadingId(scriptId)

    try {
      await runScriptAction(() => downloadScriptPdf(pdfUrl), 'downloading PDF', 'PDF 다운로드 중 오류가 발생했습니다.')
    } finally {
      setDownloadingId(currentDownloadingId => (currentDownloadingId === scriptId ? null : currentDownloadingId))
    }
  }, [])

  return {
    copiedId,
    downloadingId,
    onCopyJson,
    onDownloadJson,
    onDownloadPdf,
  }
}
