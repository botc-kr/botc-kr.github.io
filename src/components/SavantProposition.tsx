import { RefreshCwIcon } from 'lucide-react'
import { type FC, useCallback, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { type PageType } from '@/constants/pages'
import { SAVANT_PROPOSITIONS } from '@/constants/savant'
import { buildScriptImageUrl } from '@/constants/urls'

interface SavantPropositionProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
}

const SavantProposition: FC<SavantPropositionProps> = ({ currentPage, onPageChange }) => {
  const [currentProposition, setCurrentProposition] = useState(SAVANT_PROPOSITIONS[0])

  const generateNewProposition = useCallback(() => {
    if (SAVANT_PROPOSITIONS.length <= 1) {
      return
    }

    const currentIndex = SAVANT_PROPOSITIONS.indexOf(currentProposition)
    const baseRandomIndex = Math.floor(Math.random() * (SAVANT_PROPOSITIONS.length - 1))
    const nextIndex = currentIndex < 0 || baseRandomIndex < currentIndex ? baseRandomIndex : baseRandomIndex + 1
    setCurrentProposition(SAVANT_PROPOSITIONS[nextIndex])
  }, [currentProposition])

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
              src={buildScriptImageUrl('Icon_savant')}
              alt="서번트 아이콘"
              className="w-40 h-40 mx-auto mb-4 animate-spin-slow"
            />

            <button
              type="button"
              className="w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={generateNewProposition}>
              <p className="text-lg font-medium text-gray-800 mb-2">{currentProposition}</p>
              <RefreshCwIcon className="w-4 h-4 mx-auto text-gray-600" />
            </button>
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
