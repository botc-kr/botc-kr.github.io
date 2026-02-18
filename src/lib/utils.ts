import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const showFallbackMessage = (message: string, useAlert: boolean): void => {
  console.warn(message)

  if (useAlert && typeof window !== 'undefined') {
    window.alert(message)
  }
}

export function notify(message: string, fallbackAlert: boolean = true): void {
  try {
    if (typeof window === 'undefined') {
      showFallbackMessage(message, false)
      return
    }

    // Browser Notification API가 없다면 단순 콘솔로 폴백
    if (!('Notification' in window)) {
      showFallbackMessage(message, fallbackAlert)
      return
    }

    if (Notification.permission === 'granted') {
      new Notification(message)
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(message)
          return
        }

        showFallbackMessage(message, fallbackAlert)
      })
    } else {
      showFallbackMessage(message, fallbackAlert)
    }
  } catch (error) {
    console.warn('notify fallback:', error)
    showFallbackMessage(message, fallbackAlert)
  }
}
