import { RefreshCwIcon } from 'lucide-react'
import { useState } from 'react'
import { Header } from './HeaderFooter'
import { type PageType } from '@/constants/pages'

const propositions = [
  '외지인의 수가 변경되었다/변경되지 않았다.',
  '지난밤 n명의 능력이 제대로 발동되지 않았다.',
  '지난밤 요리사는 정보 n을 받았을 것이다.',
  "지난밤 정확히 n명의 마을주민이 '악한 플레이어/악마'를 대상으로 능력을 사용했다.",
  'n명 이상의 플레이어가 광기의 영향을 받고 있다.',
  '사망한 플레이어 중 n명 이상이 악한 진영이다.',
  'n개의 1회성 능력이 사용되었다.',
  '당신의 (생존한) 이웃 중 n명이 취함이나 중독 상태다.',
  '[캐릭터]와 [캐릭터]가 나란히 앉아 있다.',
  '[캐릭터]나 [캐릭터] 중 하나가 게임에 있다.',
  '[악마 캐릭터]는 이번 게임에 없다.',
  '1회성 능력이 사용되었다/사용되지 않았다.',
  '악마는 하수인/외지인과 이웃이다.',
  '선/악 진영 플레이어가 연속으로 n명 앉아있다.',
  '당신은 마녀의 저주에 걸렸다.',
  '지난밤 뱀조련사가 [캐릭터/유형]을 선택했다.',
  '악마는 n명의 마을주민과 이웃이다.',
  '지난밤 마을주민들이 받은 모든 정보는 정확했다.',
  '지난밤 선한 진영 플레이어들이 일어났다.',
  '지난밤 누군가의 역할이 바뀌었다.',
  '오늘은 광기에 걸린 사람이 없다.',
  '선/악 진영 플레이어가 광기에 걸렸다.',
  '지난밤 누군가의 진영이 바뀌었다.',
  '[플레이어]와 [플레이어]는 같은 진영이다.',
  '지난밤 누군가가 능력 사용을 거부했다.',
  '이번 게임에는 광기 관련 역할이 없다.',
  '지난밤 n명의 플레이어가 숫자 정보를 받았다.',
  '[하수인]은 매일 밤 같은 플레이어를 선택했다.',
  '게임 시작 때보다 외지인/마을주민의 수가 더 많다/적다.',
  '당신의 (생존한) 이웃들은 같은/다른 진영이다.',
  '[캐릭터]가 어제 지목을 했다.',
  '1회성 능력이 잘못된 정보를 받았다.',
  '악마가 다른 플레이어로 바뀌는 것은 불가능하다.',
  '지난밤 새로운 역할이 생성되지 않았다.',
  '당신의 이웃 중 n명이 중독되었다.',
  '악한 플레이어들이 모두 살아있다.',
  '지난밤 [하수인]이 [캐릭터]를 선택했다.',
  '당신의 이웃 중 n명이 다른 플레이어의 능력 대상이 되었다.',
  '게임 시작 시 하수인 중 최소 한 명은 악마가 누구인지 몰랐다.',
]

interface SavantPropositionProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
}

const SavantProposition: React.FC<SavantPropositionProps> = ({ currentPage, onPageChange }) => {
  const [currentProposition, setCurrentProposition] = useState(propositions[0])

  const generateNewProposition = () => {
    const newIndex = Math.floor(Math.random() * propositions.length)
    setCurrentProposition(propositions[newIndex])
  }

  return (
    <>
      <Header currentPage={currentPage} onPageChange={onPageChange} />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-5">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">서번트 명제 생성기</h1>

          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <p className="text-gray-600 mb-6 italic">
              매일 낮에 이야기꾼을 찾아가 두 가지 정보를 들을 수 있습니다.
              <br />
              하나는 진실이고 다른 하나는 거짓입니다.
            </p>

            <img
              src="https://raw.githubusercontent.com/wonhyo-e/botc-translations/refs/heads/main/assets/icons/Icon_savant.png"
              alt="서번트 아이콘"
              className="w-40 h-40 mx-auto mb-4 animate-spin-slow"
            />

            <div
              className="p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={generateNewProposition}>
              <p className="text-lg font-medium text-gray-800 mb-2">{currentProposition}</p>
              <RefreshCwIcon className="w-4 h-4 mx-auto text-gray-600" />
            </div>
          </div>

          <div className="text-sm text-gray-400">
            이 생성기는{' '}
            <a
              href="https://savant.thegrim.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-600 underline">
              savant.thegrim.gg
            </a>
            를 참고하여 한국어로 만들어졌습니다.
          </div>
        </div>
      </div>
    </>
  )
}

export default SavantProposition
