import { PAGE_TYPES, type PageType } from '@/constants/pages'
import { PAGE_CONFIG_BY_TYPE } from '@/constants/pageConfig'

const HASH_BY_PAGE: Record<PageType, string> = {
  [PAGE_TYPES.SCRIPTS]: PAGE_CONFIG_BY_TYPE[PAGE_TYPES.SCRIPTS].hash,
  [PAGE_TYPES.SAVANT]: PAGE_CONFIG_BY_TYPE[PAGE_TYPES.SAVANT].hash,
  [PAGE_TYPES.HELPER]: PAGE_CONFIG_BY_TYPE[PAGE_TYPES.HELPER].hash,
  [PAGE_TYPES.TRACKER]: PAGE_CONFIG_BY_TYPE[PAGE_TYPES.TRACKER].hash,
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

export const isPageRouteHash = (hash: string): boolean => hash.length === 0 || hash in PAGE_BY_HASH
