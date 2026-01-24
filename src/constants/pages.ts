export const PAGE_TYPES = {
  SCRIPTS: 'scripts',
  SAVANT: 'savant',
  PDF: 'pdf',
  HELPER: 'helper',
  TRACKER: 'tracker',
} as const

export type PageType = (typeof PAGE_TYPES)[keyof typeof PAGE_TYPES]

export const isPageType = (value: string): value is PageType => {
  return Object.values(PAGE_TYPES).includes(value as PageType)
}


