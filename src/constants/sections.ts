export const SECTIONS = {
  OFFICIAL: 'official',
  COMMUNITY: 'community',
  TEENSYVILLE: 'teensyville',
} as const

export type SectionId = (typeof SECTIONS)[keyof typeof SECTIONS]


