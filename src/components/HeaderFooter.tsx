import { Github } from 'lucide-react'
import { type PageType } from '@/constants/pages'

interface HeaderProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const scrollToElement = (id: string) => {
    const element = document.getElementById(id)
    const headerOffset = 80

    if (element) {
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <>
      <div className="h-16"></div>

      <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white z-50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <a href="/" className="text-xl font-bold">
                시계탑에 흐른 피
              </a>

              <div className="hidden sm:flex space-x-4">
                {currentPage === 'scripts' ? (
                  <>
                    <a
                      href="#official"
                      className="hover:text-gray-300 transition duration-200"
                      onClick={e => {
                        e.preventDefault()
                        scrollToElement('official')
                      }}>
                      공식
                    </a>
                    <a
                      href="#community"
                      className="hover:text-gray-300 transition duration-200"
                      onClick={e => {
                        e.preventDefault()
                        scrollToElement('community')
                      }}>
                      커스텀
                    </a>
                    <a
                      href="#teensyville"
                      className="hover:text-gray-300 transition duration-200"
                      onClick={e => {
                        e.preventDefault()
                        scrollToElement('teensyville')
                      }}>
                      틴시빌
                    </a>
                  </>
                ) : null}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <button
                onClick={() => onPageChange('scripts')}
                className={`hover:text-gray-300 transition duration-200 ${
                  currentPage === 'scripts' ? 'text-white' : 'text-gray-400'
                }`}>
                스크립트
              </button>
              <button
                onClick={() => onPageChange('savant')}
                className={`hover:text-gray-300 transition duration-200 ${
                  currentPage === 'savant' ? 'text-white' : 'text-gray-400'
                }`}>
                서번트
              </button>
              <a
                href="https://github.com/botc-kr/botc-kr.github.io/tree/gh-pages"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
                title="GitHub Repository">
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Blood on the Clocktower</h3>
            <p className="text-gray-400">비공식 한글화 프로젝트</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">링크</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://botc.app/" className="text-gray-400 hover:text-white">
                  공식 앱 (English)
                </a>
              </li>
              <li>
                <a href="https://bloodontheclocktower.com/" className="text-gray-400 hover:text-white">
                  공식 웹사이트 (English)
                </a>
              </li>
              <li>
                <a href="https://wiki.bloodontheclocktower.com/" className="text-gray-400 hover:text-white">
                  공식 위키 (English)
                </a>
              </li>
              <li>
                <a href="https://clocktower-wiki.gstonegames.com/" className="text-gray-400 hover:text-white">
                  공식 위키 (中文)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">커뮤니티</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://discord.gg/botc" className="text-gray-400 hover:text-white">
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ThePandemoniumInstitute/botc-release"
                  className="text-gray-400 hover:text-white">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">문의</h3>
            <p className="text-gray-400">한글화 참여, 스크립트 추가 등은 연락주세요.</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} StevenMedway, bloodontheclocktower.com, All rights reserved.</p>
          <p className="mt-2 text-sm">시계탑에 흐른 피 비공식 한글화</p>
        </div>
      </div>
    </footer>
  )
}
