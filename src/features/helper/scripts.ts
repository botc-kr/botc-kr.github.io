import { buildScriptJsonUrl } from '@/constants/urls'

export const HELPER_SCRIPTS = [
  {
    id: 'trouble_brewing',
    name: '불길한 조짐',
    url: buildScriptJsonUrl('trouble_brewing'),
  },
  {
    id: 'bad_moon_rising',
    name: '어둠을 부르는 달',
    url: buildScriptJsonUrl('bad_moon_rising'),
  },
  {
    id: 'sects_and_violets',
    name: '환란의 화원',
    url: buildScriptJsonUrl('sects_and_violets'),
  },
  {
    id: 'everyone_can_play',
    name: '모두를 위한 밤',
    url: buildScriptJsonUrl('everyone_can_play'),
  },
  {
    id: 'uncertain_death',
    name: '의문사 (Uncertain Death)',
    url: buildScriptJsonUrl('uncertain_death'),
  },
  {
    id: 'no_greater_joy',
    name: '극한의 즐거움',
    url: buildScriptJsonUrl('no_greater_joy'),
  },
  {
    id: 'laissez_un_faire',
    name: '자유방임불평등주의',
    url: buildScriptJsonUrl('laissez_un_faire'),
  },
  {
    id: 'over_the_river',
    name: '할머니댁으로',
    url: buildScriptJsonUrl('over_the_river'),
  },
  {
    id: 'pies_baking',
    name: '익어가는 파이 (Pies Baking)',
    url: buildScriptJsonUrl('pies_baking'),
  },
  {
    id: 'catfishing',
    name: 'Catfishing',
    url: buildScriptJsonUrl('catfishing'),
  },
  {
    id: 'onion_pies',
    name: 'Onion Pies',
    url: buildScriptJsonUrl('onion_pies'),
  },
] as const

export type HelperScriptId = (typeof HELPER_SCRIPTS)[number]['id']

export const HELPER_SELECTED_SCRIPT_STORAGE_KEY = 'helper_selected_script'
const DEFAULT_HELPER_SCRIPT = HELPER_SCRIPTS[0]
const HELPER_SCRIPTS_BY_ID = new Map(HELPER_SCRIPTS.map(script => [script.id, script]))

export const isHelperScriptId = (scriptId: string): scriptId is HelperScriptId =>
  HELPER_SCRIPTS_BY_ID.has(scriptId as HelperScriptId)

export const getHelperScriptById = (scriptId: HelperScriptId) =>
  HELPER_SCRIPTS_BY_ID.get(scriptId) ?? DEFAULT_HELPER_SCRIPT

export const getInitialHelperScriptId = (): HelperScriptId => {
  if (typeof window === 'undefined') {
    return DEFAULT_HELPER_SCRIPT.id
  }

  const savedScriptId = localStorage.getItem(HELPER_SELECTED_SCRIPT_STORAGE_KEY)
  return savedScriptId && isHelperScriptId(savedScriptId) ? savedScriptId : DEFAULT_HELPER_SCRIPT.id
}
