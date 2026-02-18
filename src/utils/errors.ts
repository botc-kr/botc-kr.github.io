const ABORT_ERROR_NAME = 'AbortError'
const ABORT_ERROR_MESSAGE = 'The operation was aborted.'

const createAbortError = (): Error => {
  if (typeof DOMException !== 'undefined') {
    return new DOMException(ABORT_ERROR_MESSAGE, ABORT_ERROR_NAME)
  }

  const error = new Error(ABORT_ERROR_MESSAGE)
  error.name = ABORT_ERROR_NAME
  return error
}

export const throwIfAborted = (signal?: AbortSignal): void => {
  if (signal?.aborted) {
    throw createAbortError()
  }
}

export const isAbortError = (error: unknown): boolean =>
  error instanceof Error && error.name === ABORT_ERROR_NAME
