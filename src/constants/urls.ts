export const TRANSLATIONS_DEFAULT_BASE =
  '/translations/assets'

export const TRANSLATIONS_RAW_BASE = (import.meta.env.VITE_TRANSLATIONS_BASE || TRANSLATIONS_DEFAULT_BASE).replace(
  /\/+$/,
  '',
)

const REMOTE_ASSET_BASES = [
  'https://raw.githubusercontent.com/wonhyo-e/botc-translations/refs/heads/main/assets',
  'https://raw.githubusercontent.com/wonhyo-e/botc-translations/main/assets',
  '/botc-translations/assets',
]

export const normalizeTranslationUrl = (url: string): string =>
  REMOTE_ASSET_BASES.reduce((nextUrl, remoteBase) => {
    if (nextUrl.startsWith(remoteBase)) {
      return `${TRANSLATIONS_RAW_BASE}${nextUrl.slice(remoteBase.length)}`
    }
    return nextUrl
  }, url)

export const buildScriptJsonUrl = (scriptId: string): string =>
  `${TRANSLATIONS_RAW_BASE}/scripts/ko_KR/${scriptId}.json`

export const buildScriptPdfUrl = (scriptId: string): string =>
  `${TRANSLATIONS_RAW_BASE}/pdf/ko_KR/${scriptId}.pdf`

export const buildScriptImageUrl = (imageName: string): string =>
  `${TRANSLATIONS_RAW_BASE}/images/${imageName}.png`
