import { Alignment } from '@/features/helper/types'

const GOOD_ALIGNMENT_LABEL = '선한 진영'
const EVIL_ALIGNMENT_LABEL = '악한 진영'

export const formatHelperMessage = (
  message: string,
  firstSelectedCharacterName: string,
  alignment: Alignment,
): string =>
  message
    .replace(/{character}/g, firstSelectedCharacterName)
    .replace(/{alignment}/g, alignment === Alignment.Good ? GOOD_ALIGNMENT_LABEL : EVIL_ALIGNMENT_LABEL)
