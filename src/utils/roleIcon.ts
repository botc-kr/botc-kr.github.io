import { normalizeRoleIdForIcon } from '@/utils/normalizeRoleId'

const localRoleIconMap = import.meta.glob<string>('../assets/icons/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const getRoleIconUrl = (roleId: string): string | undefined => {
  const normalizedRoleId = normalizeRoleIdForIcon(roleId)
  const iconPath = `../assets/icons/Icon_${normalizedRoleId}.png`
  return localRoleIconMap[iconPath]
}
