import { PAGE_TYPES, type PageType } from '@/constants/pages'

export const hashFromPageType = (page: PageType): string => {
  switch (page) {
    case PAGE_TYPES.SAVANT:
      return 'savant-generator'
    case PAGE_TYPES.PDF:
      return 'pdfgen'
    case PAGE_TYPES.HELPER:
      return 'helper'
    case PAGE_TYPES.SCRIPTS:
    default:
      return ''
  }
}

export const pageTypeFromHash = (hash: string): PageType => {
  switch (hash) {
    case '#savant-generator':
      return PAGE_TYPES.SAVANT
    case '#pdfgen':
      return PAGE_TYPES.PDF
    case '#helper':
      return PAGE_TYPES.HELPER
    default:
      return PAGE_TYPES.SCRIPTS
  }
}


