import { useCallback, useEffect, useRef, useState } from 'react'

import {
  MAXIMUM_TIMEBAR_HEIGHT,
  MINIMUM_TIMEBAR_HEIGHT,
  TIMEBAR_HEIGHT_STORAGE_KEY,
} from '../constants'

const DEFAULT_HEIGHT = 70

// Accessing window.localStorage throws SecurityError when storage is blocked (sandboxed
// iframe, third-party cookies disabled), so a typeof guard alone is not enough.
function getStoredHeight(defaultHeight?: number) {
  let stored: string | null = null
  try {
    stored = localStorage.getItem(TIMEBAR_HEIGHT_STORAGE_KEY)
  } catch {
    // storage unavailable — fall back to the default height
  }
  return stored ? parseInt(stored) : defaultHeight || DEFAULT_HEIGHT
}

function setStoredHeight(height: number) {
  try {
    localStorage.setItem(TIMEBAR_HEIGHT_STORAGE_KEY, height.toString())
  } catch {
    // storage unavailable — the height still applies for this session
  }
}

/**
 * Drag-to-resize the timebar height. Height is kept local (not in context) so a
 * drag only re-renders the root container, never the toolbar/track subscribers.
 */
export function useResizableHeight({
  isResizable,
  defaultHeight,
}: {
  isResizable?: boolean
  defaultHeight?: number
}) {
  const [height, setHeight] = useState(() => getStoredHeight(defaultHeight))
  const [isDragging, setIsDragging] = useState(false)
  const startCursorY = useRef<number | null>(null)
  const startHeight = useRef<number | null>(null)

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (startCursorY.current === null || startHeight.current === null) return
    const cursorYDelta = startCursorY.current - e.clientY
    const newHeight = Math.max(
      MINIMUM_TIMEBAR_HEIGHT,
      Math.min(startHeight.current + cursorYDelta, MAXIMUM_TIMEBAR_HEIGHT)
    )
    setHeight(newHeight)
    setStoredHeight(newHeight)
  }, [])

  const onMouseUp = useCallback(() => {
    setIsDragging(false)
    startCursorY.current = null
    startHeight.current = null
  }, [])

  const onResizerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isResizable) return
      e.preventDefault()
      e.stopPropagation()
      startCursorY.current = e.clientY
      startHeight.current = height
      setIsDragging(true)
    },
    [isResizable, height]
  )

  useEffect(() => {
    if (!isDragging) return
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging, onMouseMove, onMouseUp])

  return { height, isDragging, onResizerMouseDown }
}
