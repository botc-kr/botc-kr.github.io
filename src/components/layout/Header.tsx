import type { FC } from 'react'
import { Github } from 'lucide-react'
import { PAGE_TYPES, type PageType } from '@/constants/pages'
import { TOP_NAV_ITEMS } from '@/constants/pageConfig'
import { SECTIONS } from '@/constants/sections'
import { HEADER_OFFSET_PX } from '@/constants/ui'
import { scrollToElementById } from '@/utils/scroll'

interface HeaderProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
}

const scriptSectionLinks = [
  { id: SECTIONS.OFFICIAL, label: '공식' },
  { id: SECTIONS.COMMUNITY, label: '커스텀' },
  { id: SECTIONS.TEENSYVILLE, label: '틴시빌' },
] as const

export const Header: FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const scrollToElement = (id: string): void => {
    scrollToElementById(id, HEADER_OFFSET_PX)
  }

  return (
    <>
      <div className="h-16" />

      <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white z-50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button type="button" onClick={() => onPageChange(PAGE_TYPES.SCRIPTS)} className="text-xl font-bold">
                시계탑에 흐른 피
              </button>

              <div className="hidden sm:flex space-x-4">
                {currentPage === PAGE_TYPES.SCRIPTS
                  ? scriptSectionLinks.map(link => (
                      <a
                        key={link.id}
                        href={`#${link.id}`}
                        className="hover:text-gray-300 transition duration-200"
                        onClick={event => {
                          event.preventDefault()
                          scrollToElement(link.id)
                        }}>
                        {link.label}
                      </a>
                    ))
                  : null}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {TOP_NAV_ITEMS.map(navItem => (
                <button
                  key={navItem.page}
                  type="button"
                  onClick={() => onPageChange(navItem.page)}
                  className={`hover:text-gray-300 transition duration-200 ${
                    currentPage === navItem.page ? 'text-white' : 'text-gray-400'
                  }`}>
                  {navItem.label}
                </button>
              ))}
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
