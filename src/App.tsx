import { useEffect, useState } from 'react'
import { Footer } from './components/HeaderFooter'
import SavantProposition from './components/SavantProposition'
import ScriptList from './components/ScriptList'
import PDFGenerator from './components/PDFGenerator'

function App() {
  const [currentPage, setCurrentPage] = useState<'scripts' | 'savant' | 'pdf'>(() => {
    if (window.location.hash === '#savant-generator') return 'savant'
    if (window.location.hash === '#pdfgen') return 'pdf'
    return 'scripts'
  })

  const handlePageChange = (page: 'scripts' | 'savant' | 'pdf') => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setCurrentPage(page)
    window.location.hash = page === 'savant' ? 'savant-generator' : page === 'pdf' ? 'pdfgen' : ''
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      const page = hash === '#savant-generator' ? 'savant' : hash === '#pdfgen' ? 'pdf' : 'scripts'
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'scripts' ? (
        <ScriptList currentPage={currentPage} onPageChange={handlePageChange} />
      ) : currentPage === 'pdf' ? (
        <PDFGenerator />
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
