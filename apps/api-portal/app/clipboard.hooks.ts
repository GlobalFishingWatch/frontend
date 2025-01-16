import { useCallback, useEffect, useRef, useState } from 'react'
import copyToClipboard from 'lib/clipboard'

type ClipboardNotification = {
  [key: string]: boolean
}

export function useClipboardNotification(feedbackTime = 10000) {
  const timeoutRef = useRef<any>(undefined)
  const [clipboardNotification, setClipboardNotification] = useState<ClipboardNotification>({})

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
      setClipboardNotification({ [stringToClipboard]: true })
      copyToClipboard(stringToClipboard)
      timeoutRef.current = setTimeout(() => {
        setClipboardNotification({ [stringToClipboard]: false })
      }, feedbackTime)
    },
    [feedbackTime]
  )

  return {
    showClipboardNotification: (text: string) => clipboardNotification[text],
    copyToClipboard: copyToClipboardTimeout,
  }
}
