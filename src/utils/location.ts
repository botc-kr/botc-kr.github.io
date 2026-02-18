export const clearCurrentLocationHash = (): void => {
  if (typeof window === 'undefined') {
    return
  }

  if (window.location.hash.length === 0) {
    return
  }

  window.history.pushState('', document.title, window.location.pathname + window.location.search)
}

export const getCurrentHashValue = (): string => {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.location.hash.replace(/^#/, '')
}

export const buildCurrentPathUrlWithHash = (hashValue: string): string => {
  if (typeof window === 'undefined') {
    return hashValue.length > 0 ? `#${hashValue}` : ''
  }

  const baseUrl = `${window.location.origin}${window.location.pathname}`
  return hashValue.length > 0 ? `${baseUrl}#${hashValue}` : baseUrl
}
