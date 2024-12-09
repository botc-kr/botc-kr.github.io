import { ChangeEvent, useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'

import townsfolk from '@assets/images/townsfolk.png'
import outsider from '@assets/images/outsider.png'
import minion from '@assets/images/minion.png'
import demon from '@assets/images/demon.png'
import { dum1 } from '@/assets/fonts/dum1'
import { chungjuKimSaeng } from '@/assets/fonts/chungjuKimSaeng'
import { nanumGothic } from '@/assets/fonts/nanumGothic'
import { nanumGothicBold } from '@/assets/fonts/nanumGothicBold'

const TEAMS = ['townsfolk', 'outsider', 'minion', 'demon']
const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const MARGIN = 1

export default function PDFGenerator() {
  const [jsonContent, setJsonContent] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [pdfUrl, setPdfUrl] = useState<string>('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      setJsonContent(e.target?.result as string)
      setError('')
      generatePDF()
    }
    reader.readAsText(file)
  }

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [pdfUrl])

  const generatePDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [PAGE_WIDTH, PAGE_HEIGHT],
      })

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }

      // base64 폰트 추가
      doc.addFileToVFS('NanumGothic.ttf', nanumGothic)
      doc.addFileToVFS('NanumGothic-Bold.ttf', nanumGothicBold)
      doc.addFileToVFS('dum1.ttf', dum1)
      doc.addFileToVFS('ChungjuKimSaeng.ttf', chungjuKimSaeng)
      debugger

      // 폰트 등록
      doc.addFont('NanumGothic.ttf', 'NanumGothic', 'normal')
      doc.addFont('NanumGothic-Bold.ttf', 'NanumGothic', 'bold')
      doc.addFont('dum1.ttf', 'Dumbledor', 'normal')
      doc.addFont('ChungjuKimSaeng.ttf', 'Changjukimsaeng', 'normal')

      doc.setFont('NanumGothic')
      doc.setLanguage('ko-KR')

      let yPos = MARGIN + 10

      // 폰트 샘플 텍스트 렌더링
      const renderFontSamples = () => {
        const sampleText = '안녕하세요 Hello 1234'
        doc.setFontSize(12)

        doc.setFont('NanumGothic', 'normal')
        doc.text('NanumGothic Normal: ' + sampleText, MARGIN, yPos)
        yPos += 10

        doc.setFont('NanumGothic', 'bold')
        doc.text('NanumGothic Bold: ' + sampleText, MARGIN, yPos)
        yPos += 10

        doc.setFont('Dumbledor', 'normal')
        doc.text('Dumbledor: ' + sampleText, MARGIN, yPos)
        yPos += 10

        doc.setFont('Changjukimsaeng', 'normal')
        doc.text('Changjukimsaeng: ' + sampleText, MARGIN, yPos)
        yPos += 20
      }

      // 이미지 렌더링
      const renderImages = async () => {
        const images = { townsfolk, outsider, minion, demon }

        for (const team of TEAMS) {
          const img = images[team as keyof typeof images]
          const imgElement = new Image()
          imgElement.src = img

          await new Promise(resolve => {
            imgElement.onload = () => {
              const originalWidth = (imgElement.width * 25.4) / 96
              const originalHeight = (imgElement.height * 25.4) / 96

              const maxWidth = PAGE_WIDTH - 2 * MARGIN
              const scale = Math.min(1, maxWidth / originalWidth)
              const finalWidth = originalWidth * scale
              const finalHeight = originalHeight * scale

              if (yPos + finalHeight > PAGE_HEIGHT - MARGIN) {
                doc.addPage()
                yPos = MARGIN
              }

              doc.addImage(img, 'PNG', MARGIN, yPos, finalWidth, finalHeight)
              yPos += finalHeight + MARGIN
              resolve(null)
            }
          })
        }
      }

      renderFontSamples()
      await renderImages()

      const pdfBlob = doc.output('blob')
      const url = URL.createObjectURL(pdfBlob)
      setPdfUrl(url)
    } catch (err) {
      setError(`PDF 생성 중 오류 발생: ${err}`)
    }
  }

  return (
    <div className="p-8">
      <input type="file" accept=".json" onChange={handleFileChange} className="mb-4 block" />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex gap-4 mb-4">
        {jsonContent && (
          <>
            <button onClick={generatePDF} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              미리보기 새로고침
            </button>
            <button
              onClick={() => pdfUrl && window.open(pdfUrl, '_blank')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              새 탭에서 열기
            </button>
          </>
        )}
      </div>
      {pdfUrl && (
        <div className="w-full h-[800px] border border-gray-300 rounded">
          <iframe src={pdfUrl} className="w-full h-full" title="PDF Preview" />
        </div>
      )}
    </div>
  )
}
