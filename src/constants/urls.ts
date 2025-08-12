export const TRANSLATIONS_RAW_BASE =
  'https://raw.githubusercontent.com/wonhyo-e/botc-translations/refs/heads/main/assets'

export const buildScriptJsonUrl = (scriptId: string): string =>
  `${TRANSLATIONS_RAW_BASE}/scripts/ko_KR/${scriptId}.json`

export const buildScriptPdfUrl = (scriptId: string): string =>
  `${TRANSLATIONS_RAW_BASE}/pdf/ko_KR/${scriptId}.pdf`

export const buildScriptImageUrl = (imageName: string): string =>
  `${TRANSLATIONS_RAW_BASE}/images/${imageName}.png`


