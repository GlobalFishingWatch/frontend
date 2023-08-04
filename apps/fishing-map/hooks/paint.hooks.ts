import { useEffect } from 'react'

function runAfterFramePaint(callback) {
  requestAnimationFrame(() => {
    const messageChannel = new MessageChannel()

    messageChannel.port1.onmessage = callback
    messageChannel.port2.postMessage(undefined)
  })
}

export function useCallbackAfterPaint({ callback, enabled }) {
  useEffect(() => {
    /**
     * Only perform the log when the calling component has signaled it is
     * ready to log a meaningful visual update.
     */
    if (!enabled) {
      return
    }

    // Queues a requestAnimationFrame and onmessage
    runAfterFramePaint(callback)
  }, [callback, enabled])
}
