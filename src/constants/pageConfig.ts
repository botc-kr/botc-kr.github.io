import { PAGE_TYPES, type PageType } from '@/constants/pages'

interface PageConfig {
  hash: string
  navLabel: string
}

export const PAGE_CONFIG_BY_TYPE: Record<PageType, PageConfig> = {
  [PAGE_TYPES.SCRIPTS]: { hash: '', navLabel: '스크립트' },
  [PAGE_TYPES.SAVANT]: { hash: 'savant-generator', navLabel: '서번트' },
  [PAGE_TYPES.HELPER]: { hash: 'helper', navLabel: '헬퍼' },
  [PAGE_TYPES.TRACKER]: { hash: 'tracker', navLabel: '트래커' },
}

const TOP_NAV_PAGE_ORDER: PageType[] = [PAGE_TYPES.SCRIPTS, PAGE_TYPES.SAVANT, PAGE_TYPES.HELPER, PAGE_TYPES.TRACKER]

export const TOP_NAV_ITEMS = TOP_NAV_PAGE_ORDER.map(pageType => ({
  page: pageType,
  label: PAGE_CONFIG_BY_TYPE[pageType].navLabel,
}))
