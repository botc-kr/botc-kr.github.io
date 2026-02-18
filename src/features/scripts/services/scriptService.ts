import { Script } from '@/features/scripts/types'
import { normalizeTranslationUrl } from '@/constants/urls'
import { fetchWithRetry } from '@/utils/fetchRetry'

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetchWithRetry(url)
  return (await response.json()) as T
}

export const fetchScripts = async (): Promise<Script[]> => {
  const scripts = await fetchJson<Script[]>('/scripts.json')
  return scripts.map(script => ({
    ...script,
    json: normalizeTranslationUrl(script.json),
    pdf: normalizeTranslationUrl(script.pdf),
    logo: normalizeTranslationUrl(script.logo),
  }))
}

export const copyScriptJsonToClipboard = async (jsonUrl: string): Promise<void> => {
  const jsonData = await fetchJson<unknown>(jsonUrl)
  await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))
}

export const downloadScriptJson = async (jsonUrl: string, fileName: string): Promise<void> => {
  const jsonData = await fetchJson<unknown>(jsonUrl)
  const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
  downloadBlob(jsonBlob, `${fileName}.json`)
}

export const downloadScriptPdf = async (pdfUrl: string): Promise<void> => {
  const response = await fetchWithRetry(pdfUrl)
  const pdfBlob = await response.blob()
  const fileName = pdfUrl.split('/').pop() ?? 'script.pdf'
  downloadBlob(pdfBlob, fileName)
}

const downloadBlob = (blob: Blob, fileName: string): void => {
  const blobUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = blobUrl
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(blobUrl)
}
