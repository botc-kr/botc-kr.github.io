import { Script } from '@/features/scripts/types'
import { normalizeTranslationUrl } from '@/constants/urls'
import { copyTextToClipboard } from '@/utils/clipboard'
import { triggerBlobDownload } from '@/utils/download'
import { fetchJsonWithRetry } from '@/utils/fetchJson'
import { fetchWithRetry } from '@/utils/fetchRetry'

export const fetchScripts = async (signal?: AbortSignal): Promise<Script[]> => {
  const scripts = await fetchJsonWithRetry<Script[]>('/scripts.json', { signal })
  return scripts.map(script => ({
    ...script,
    json: normalizeTranslationUrl(script.json),
    pdf: normalizeTranslationUrl(script.pdf),
    logo: typeof script.logo === 'string' ? normalizeTranslationUrl(script.logo) : '',
  }))
}

export const copyScriptJsonToClipboard = async (jsonUrl: string): Promise<void> => {
  await copyTextToClipboard(await getPrettyScriptJson(jsonUrl))
}

export const downloadScriptJson = async (jsonUrl: string, fileName: string): Promise<void> => {
  const jsonBlob = new Blob([await getPrettyScriptJson(jsonUrl)], { type: 'application/json' })
  triggerBlobDownload(jsonBlob, `${fileName}.json`)
}

export const downloadScriptPdf = async (pdfUrl: string): Promise<void> => {
  const response = await fetchWithRetry(pdfUrl)
  const pdfBlob = await response.blob()
  const fileName = pdfUrl.split('/').pop() ?? 'script.pdf'
  triggerBlobDownload(pdfBlob, fileName)
}

const getPrettyScriptJson = async (jsonUrl: string): Promise<string> => {
  const jsonData = await fetchJsonWithRetry<unknown>(jsonUrl)
  return JSON.stringify(jsonData, null, 2)
}
