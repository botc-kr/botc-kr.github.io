import { Script } from '@/types/types'

type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>

export const fetchScripts = async (
  setScripts: SetStateFunction<Script[]>,
  setLoading: SetStateFunction<boolean>
): Promise<void> => {
  try {
    const response = await fetch('/scripts.json')
    const data: Script[] = await response.json()
    setScripts(data)
    setLoading(false)
  } catch (error) {
    console.error('Error loading scripts:', error)
    setLoading(false)
  }
}

export const handleCopyJson = async (
  jsonUrl: string,
  scriptId: string,
  setCopiedId: SetStateFunction<string | null>
): Promise<void> => {
  try {
    const response = await fetch(jsonUrl)
    const json = await response.json()
    await navigator.clipboard.writeText(JSON.stringify(json, null, 2))
    setCopiedId(scriptId)
    setTimeout(() => {
      setCopiedId(null)
    }, 1000)
  } catch (error) {
    console.error('Error copying JSON:', error)
    alert('JSON 복사 중 오류가 발생했습니다.')
  }
}

export const handleDownloadJson = async (
  jsonUrl: string,
  fileName: string
): Promise<void> => {
  try {
    const response = await fetch(jsonUrl)
    const json = await response.json()
    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: 'application/json'
    })
    downloadFile(blob, `${fileName}.json`)
  } catch (error) {
    console.error('Error downloading JSON:', error)
    alert('JSON 다운로드 중 오류가 발생했습니다.')
  }
}

export const handleDownloadPdf = async (
  pdfUrl: string,
  scriptId: string,
  setDownloadingId: SetStateFunction<string | null>
): Promise<void> => {
  try {
    setDownloadingId(scriptId)
    const fileName = pdfUrl.split('/').pop() as string
    const response = await fetch(pdfUrl)
    const blob = await response.blob()
    downloadFile(blob, fileName)
  } catch (error) {
    console.error('Error downloading PDF:', error)
    alert('PDF 다운로드 중 오류가 발생했습니다.')
  } finally {
    setDownloadingId(null)
  }
}

const downloadFile = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
