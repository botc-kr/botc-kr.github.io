export const isClipboardAvailable = (): boolean =>
  typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function'

export const copyTextToClipboard = async (text: string): Promise<void> => {
  if (!isClipboardAvailable()) {
    throw new Error('Clipboard API is not available')
  }

  await navigator.clipboard.writeText(text)
}
