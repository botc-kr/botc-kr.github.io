import { PAGE_TYPES, type PageType } from '@/constants/pages'

export const hashFromPageType = (page: PageType): string => {
  switch (page) {
    case PAGE_TYPES.SAVANT:
      return 'savant-generator'
    case PAGE_TYPES.HELPER:
      return 'helper'
    case PAGE_TYPES.TRACKER:
      return 'tracker'
    case PAGE_TYPES.SCRIPTS:
    default:
      return ''
  }
}

export const pageTypeFromHash = (hash: string): PageType => {
  switch (hash) {
    case '#savant-generator':
      return PAGE_TYPES.SAVANT
    case '#helper':
      return PAGE_TYPES.HELPER
    case '#tracker':
      return PAGE_TYPES.TRACKER
    default:
      return PAGE_TYPES.SCRIPTS
  }
}

