import { PAGE_TYPES, type PageType } from '@/constants/pages'

const HASH_BY_PAGE: Record<PageType, string> = {
  [PAGE_TYPES.SCRIPTS]: '',
  [PAGE_TYPES.SAVANT]: 'savant-generator',
  [PAGE_TYPES.HELPER]: 'helper',
  [PAGE_TYPES.TRACKER]: 'tracker',
}

const PAGE_BY_HASH: Record<string, PageType> = Object.entries(HASH_BY_PAGE).reduce(
  (acc, [pageType, hash]) => {
    if (hash.length > 0) {
      acc[`#${hash}`] = pageType as PageType
    }
    return acc
  },
  {} as Record<string, PageType>,
)

export const hashFromPageType = (page: PageType): string => HASH_BY_PAGE[page]

export const pageTypeFromHash = (hash: string): PageType => PAGE_BY_HASH[hash] ?? PAGE_TYPES.SCRIPTS
