import { useEffect, useState } from 'react'
import { Footer } from './components/HeaderFooter'
import SavantProposition from './components/SavantProposition'
import ScriptList from './components/ScriptList'
// import PDFGenerator from './components/PDFGenerator'
import Helper from './components/helper/Helper'

const PAGE_TYPES = {
  SCRIPTS: 'scripts',
  SAVANT: 'savant',
  PDF: 'pdf',
  HELPER: 'helper',
} as const

export type PageType = (typeof PAGE_TYPES)[keyof typeof PAGE_TYPES]

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    if (window.location.hash === '#savant-generator') return PAGE_TYPES.SAVANT
    if (window.location.hash === '#pdfgen') return PAGE_TYPES.PDF
    if (window.location.hash === '#helper') return PAGE_TYPES.HELPER
    return PAGE_TYPES.SCRIPTS
  })

  const handlePageChange = (page: PageType) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setCurrentPage(page)
    window.location.hash =
      page === PAGE_TYPES.SAVANT
        ? 'savant-generator'
        : page === PAGE_TYPES.PDF
        ? 'pdfgen'
        : page === PAGE_TYPES.HELPER
        ? 'helper'
        : ''
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      const page =
        hash === '#savant-generator'
          ? PAGE_TYPES.SAVANT
          : hash === '#pdfgen'
          ? PAGE_TYPES.PDF
          : hash === '#helper'
          ? PAGE_TYPES.HELPER
          : PAGE_TYPES.SCRIPTS
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === PAGE_TYPES.SCRIPTS ? (
        <ScriptList currentPage={currentPage} onPageChange={handlePageChange} />
      ) : currentPage === PAGE_TYPES.PDF ? (
        // <PDFGenerator />
        <></>
      ) : currentPage === PAGE_TYPES.HELPER ? (
        <Helper currentPage={currentPage} onPageChange={handlePageChange} />
      ) : (
        <>
          <SavantProposition currentPage={currentPage} onPageChange={handlePageChange} />
          <Footer />
        </>
      )}
    </div>
  )
}

export default App
