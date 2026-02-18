import { SECTIONS } from '@/constants/sections'
import type { Script } from '@/features/scripts/types'

interface ScriptBuckets {
  official: Script[]
  community: Script[]
  teensyville: Script[]
}

export interface ScriptCategoryGroup {
  id: string
  title: string
  scripts: Script[]
}

export const buildScriptCategories = (scripts: Script[]): ScriptCategoryGroup[] => {
  const buckets = scripts.reduce<ScriptBuckets>(
    (currentBuckets, script) => {
      if (script.official) {
        currentBuckets.official.push(script)
      } else if (script.teensyville) {
        currentBuckets.teensyville.push(script)
      } else {
        currentBuckets.community.push(script)
      }

      return currentBuckets
    },
    { official: [], community: [], teensyville: [] },
  )

  return [
    { id: SECTIONS.OFFICIAL, title: '공식 스크립트', scripts: buckets.official },
    { id: SECTIONS.COMMUNITY, title: '커스텀 스크립트', scripts: buckets.community },
    { id: SECTIONS.TEENSYVILLE, title: '틴시빌 스크립트', scripts: buckets.teensyville },
  ]
}
