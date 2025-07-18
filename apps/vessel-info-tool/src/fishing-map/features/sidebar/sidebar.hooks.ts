import { useCallback, useEffect, useRef, useState } from 'react'

import copyToClipboard from 'utils/clipboard'

export function useClipboardNotification(feedbackTime = 10000) {
  const timeoutRef = useRef<any>(undefined)
  const [showClipboardNotification, setShowClipboardNotification] = useState(false)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const copyToClipboardTimeout = useCallback(
    (stringToClipboard: string) => {
      if (!stringToClipboard) {
        console.warn('No string to copy')
      }
      setShowClipboardNotification(true)
      copyToClipboard(stringToClipboard)
      timeoutRef.current = setTimeout(() => {
        setShowClipboardNotification(false)
      }, feedbackTime)
    },
    [feedbackTime]
  )

  return { showClipboardNotification, copyToClipboard: copyToClipboardTimeout }
}
