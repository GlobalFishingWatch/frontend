import { useCallback, useEffect, useRef, useState } from 'react'

import { getUTCDate } from '@globalfishingwatch/data-transforms'

import type { TimebarChangeSource, TimebarProps } from './timebar'

type Range = { start: string; end: string }

// Echo lag is at most a couple of commits behind the rAF loop, so a short window is
// plenty; the buffer is cleared whenever an external change is adopted.
const EMITTED_ECHO_BUFFER_SIZE = 20

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
  const emittedRef = useRef<string[]>([`${start}|${end}`])

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
      emittedRef.current.push(`${clampedStart}|${clampedEnd}`)
      if (emittedRef.current.length > EMITTED_ECHO_BUFFER_SIZE) {
        emittedRef.current.shift()
      }
      setRange(rangeRef.current)
      onChange({ start: clampedStart, end: clampedEnd, source })
    },
    [minimumRangeMs, maximumRangeMs, onChange]
  )

  useEffect(() => {
    if (start === rangeRef.current.start && end === rangeRef.current.end) return
    if (emittedRef.current.includes(`${start}|${end}`)) return
    emittedRef.current = []
    rangeRef.current = { start, end }
    setRange({ start, end })
  }, [start, end])

  return { range, rangeRef, notifyChange }
}
