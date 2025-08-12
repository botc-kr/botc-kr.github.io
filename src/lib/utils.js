import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function notify(message, fallbackAlert = true) {
  try {
    // Browser Notification API가 없다면 단순 콘솔로 폴백
    if (!('Notification' in window)) {
      console.warn(message)
      if (fallbackAlert) alert(message)
      return
    }
    if (Notification.permission === 'granted') {
      new Notification(message)
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') new Notification(message)
        else if (fallbackAlert) alert(message)
      })
    } else if (fallbackAlert) {
      alert(message)
    }
  } catch (e) {
    console.warn('notify fallback:', e)
    if (fallbackAlert) alert(message)
  }
}
