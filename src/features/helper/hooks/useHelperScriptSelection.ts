import { useCallback, useMemo, useState } from 'react'
import {
  HELPER_SELECTED_SCRIPT_STORAGE_KEY,
  getHelperScriptById,
  getInitialHelperScriptId,
  isHelperScriptId,
} from '@/features/helper/scripts'
import type { HelperScriptId } from '@/features/helper/scripts'
import { setLocalStorageItem } from '@/utils/browserStorage'

export const useHelperScriptSelection = () => {
  const [selectedScriptId, setSelectedScriptId] = useState<HelperScriptId>(getInitialHelperScriptId)
  const selectedScript = useMemo(() => getHelperScriptById(selectedScriptId), [selectedScriptId])

  const handleScriptChange = useCallback((scriptId: string): void => {
    if (!isHelperScriptId(scriptId)) {
      return
    }

    setSelectedScriptId(scriptId)
    setLocalStorageItem(HELPER_SELECTED_SCRIPT_STORAGE_KEY, scriptId)
  }, [])

  return {
    selectedScriptId,
    selectedScript,
    handleScriptChange,
  }
}
