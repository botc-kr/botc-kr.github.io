export const scrollToTop = (behavior: ScrollBehavior = 'smooth'): void => {
  window.scrollTo({ top: 0, behavior })
}

export const scrollToElementWithOffset = (
  element: Element,
  offsetPx: number,
  behavior: ScrollBehavior = 'smooth',
): void => {
  const targetTop = element.getBoundingClientRect().top + window.scrollY - offsetPx
  window.scrollTo({ top: targetTop, behavior })
}

export const scrollToElementById = (
  elementId: string,
  offsetPx: number,
  behavior: ScrollBehavior = 'smooth',
): boolean => {
  const target = document.getElementById(elementId)
  if (!target) {
    return false
  }

  scrollToElementWithOffset(target, offsetPx, behavior)
  return true
}
