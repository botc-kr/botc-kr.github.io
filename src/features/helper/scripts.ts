import { buildScriptJsonUrl } from '@/constants/urls'
import { getLocalStorageItem } from '@/utils/browserStorage'

const createHelperScript = <ScriptId extends string>(id: ScriptId, name: string) => ({
  id,
  name,
  url: buildScriptJsonUrl(id),
})

export const HELPER_SCRIPTS = [
  createHelperScript('trouble_brewing', '불길한 조짐'),
  createHelperScript('bad_moon_rising', '어둠을 부르는 달'),
  createHelperScript('sects_and_violets', '환란의 화원'),
  createHelperScript('everyone_can_play', '모두를 위한 밤'),
  createHelperScript('uncertain_death', '의문사 (Uncertain Death)'),
  createHelperScript('no_greater_joy', '극한의 즐거움'),
  createHelperScript('laissez_un_faire', '자유방임불평등주의'),
  createHelperScript('over_the_river', '할머니댁으로'),
  createHelperScript('pies_baking', '익어가는 파이 (Pies Baking)'),
  createHelperScript('catfishing', 'Catfishing'),
  createHelperScript('onion_pies', 'Onion Pies'),
  createHelperScript('nobody_fucking_move', '아무도 움직이지 마'),
  createHelperScript('the_ballad_of_seat_7', '7번 좌석의 발라드'),
] as const

export type HelperScriptId = (typeof HELPER_SCRIPTS)[number]['id']
type HelperScript = (typeof HELPER_SCRIPTS)[number]

export const HELPER_SELECTED_SCRIPT_STORAGE_KEY = 'helper_selected_script'
const DEFAULT_HELPER_SCRIPT = HELPER_SCRIPTS[0]
const HELPER_SCRIPTS_BY_ID = new Map<string, HelperScript>(HELPER_SCRIPTS.map(script => [script.id, script]))

export const isHelperScriptId = (scriptId: string): scriptId is HelperScriptId => HELPER_SCRIPTS_BY_ID.has(scriptId)

export const getHelperScriptById = (scriptId: HelperScriptId) =>
  HELPER_SCRIPTS_BY_ID.get(scriptId) ?? DEFAULT_HELPER_SCRIPT

export const getInitialHelperScriptId = (): HelperScriptId => {
  const savedScriptId = getLocalStorageItem(HELPER_SELECTED_SCRIPT_STORAGE_KEY)
  return savedScriptId && isHelperScriptId(savedScriptId) ? savedScriptId : DEFAULT_HELPER_SCRIPT.id
}
