import type { FC } from 'react'

interface FooterLink {
  href: string
  label: string
}

interface FooterLinkSection {
  title: string
  links: FooterLink[]
}

const FOOTER_LINK_SECTIONS: FooterLinkSection[] = [
  {
    title: '링크',
    links: [
      { href: 'https://botc.app/', label: '공식 앱 (English)' },
      { href: 'https://bloodontheclocktower.com/', label: '공식 웹사이트 (English)' },
      { href: 'https://wiki.bloodontheclocktower.com/', label: '공식 위키 (English)' },
      { href: 'https://clocktower-wiki.gstonegames.com/', label: '공식 위키 (中文)' },
    ],
  },
  {
    title: '커뮤니티',
    links: [
      { href: 'https://discord.gg/botc', label: 'Discord' },
      { href: 'https://github.com/ThePandemoniumInstitute/botc-release', label: 'GitHub' },
    ],
  },
]

export const Footer: FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Blood on the Clocktower</h3>
            <p className="text-gray-400">비공식 한글화 프로젝트</p>
          </div>

          {FOOTER_LINK_SECTIONS.map(section => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.href}>
                    <a href={link.href} className="text-gray-400 hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

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
