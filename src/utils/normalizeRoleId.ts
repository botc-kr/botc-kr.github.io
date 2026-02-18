export const normalizeRoleId = (roleId: string): string => roleId.replace(/^(kokr|ko_KR)_?/, '')

export const normalizeRoleIdForIcon = normalizeRoleId
