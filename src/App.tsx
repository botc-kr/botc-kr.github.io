import { useEffect, useState } from 'react'
import { Footer } from '@/components/HeaderFooter'
import SavantProposition from '@/components/SavantProposition'
import ScriptList from '@/features/scripts/components/ScriptList'
// import PDFGenerator from '@/components/PDFGenerator'
import Helper from '@/components/helper/Helper'
import TrackerApp from '@/components/tracker/TrackerApp'
import { PAGE_TYPES, type PageType } from '@/constants/pages'
import { pageTypeFromHash, hashFromPageType } from '@/constants/routes'

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>(() => pageTypeFromHash(window.location.hash))

  const handlePageChange = (page: PageType) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setCurrentPage(page)
    window.location.hash = hashFromPageType(page)
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      const page = pageTypeFromHash(hash)
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
        <Helper />
      ) : currentPage === PAGE_TYPES.TRACKER ? (
        <TrackerApp />
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
