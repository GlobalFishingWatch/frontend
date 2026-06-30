import { useCallback, useEffect, useRef, useState } from 'react'

import { getUTCDate } from '@globalfishingwatch/data-transforms'

import type { TimebarChangeSource, TimebarProps } from './timebar'

type Range = { start: string; end: string }

const clampToMinAndMax = (
  start: string,
  end: string,
  minMs: number,
  maxMs: number,
  clampToEnd: boolean
) => {
  const delta = getUTCDate(end).getTime() - getUTCDate(start).getTime()
  let clampedEnd = end
  let clampedStart = start
  if (delta > maxMs) {
    if (clampToEnd === true) {
      clampedEnd = getUTCDate(getUTCDate(start).getTime() + maxMs).toISOString()
    } else {
      clampedStart = getUTCDate(getUTCDate(end).getTime() - maxMs).toISOString()
    }
  } else if (delta < minMs) {
    if (clampToEnd === true) {
      clampedEnd = getUTCDate(getUTCDate(start).getTime() + minMs).toISOString()
    } else {
      clampedStart = getUTCDate(getUTCDate(end).getTime() - minMs).toISOString()
    }
  }
  return { clampedStart, clampedEnd }
}

type UseTimebarRangeParams = {
  start: string
  end: string
  minimumRangeMs: number
  maximumRangeMs: number
  onChange: TimebarProps['onChange']
}

export const useTimebarRange = ({
  start,
  end,
  minimumRangeMs,
  maximumRangeMs,
  onChange,
}: UseTimebarRangeParams) => {
  const rangeRef = useRef<Range>({ start, end })
  const [range, setRange] = useState<Range>({ start, end })
  const interactingRef = useRef(false)

  const notifyChange = useCallback(
    (s: string, e: string, source?: TimebarChangeSource, clampToEnd = false) => {
      const { clampedStart, clampedEnd } = clampToMinAndMax(
        s,
        e,
        minimumRangeMs,
        maximumRangeMs,
        clampToEnd
      )
      rangeRef.current = { start: clampedStart, end: clampedEnd }
      setRange(rangeRef.current)
      onChange({ start: clampedStart, end: clampedEnd, source })
    },
    [minimumRangeMs, maximumRangeMs, onChange]
  )

  const beginInteraction = useCallback(() => {
    interactingRef.current = true
  }, [])
  const endInteraction = useCallback(() => {
    interactingRef.current = false
  }, [])

  useEffect(() => {
    if (interactingRef.current) return
    if (start !== rangeRef.current.start || end !== rangeRef.current.end) {
      rangeRef.current = { start, end }
      setRange({ start, end })
    }
  }, [start, end])

  return { range, rangeRef, notifyChange, beginInteraction, endInteraction }
}
