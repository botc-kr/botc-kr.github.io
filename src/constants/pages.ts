export const PAGE_TYPES = {
  SCRIPTS: 'scripts',
  SAVANT: 'savant',
  HELPER: 'helper',
  TRACKER: 'tracker',
} as const

export type PageType = (typeof PAGE_TYPES)[keyof typeof PAGE_TYPES]

