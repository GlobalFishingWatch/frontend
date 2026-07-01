import { useCallback } from 'react'
import type { DateTimeUnit } from 'luxon'

import type { TimebarChangeSource } from '../timebar'
import type { TimebarLabels } from '../timebar-labels'
import type { TimelineScale } from '../timeline/timeline-context'
import { clampToAbsoluteBoundaries, getDeltaDays, getDeltaMs } from '../utils'

import { getUnitsPositions } from './timeline-layout'

import styles from './timeline-units.module.css'

type TimelineUnitsProps = {
  labels: TimebarLabels
  onChange: (start: string, end: string, source?: TimebarChangeSource, clampToEnd?: boolean) => void
  start: string
  end: string
  absoluteStart: string
  absoluteEnd: string
  outerStart: string
  outerEnd: string
  outerScale: TimelineScale
  locale: string
}

const TimelineUnits = ({
  labels,
  onChange,
  start,
  end,
  absoluteStart,
  absoluteEnd,
  outerStart,
  outerEnd,
  outerScale,
  locale,
}: TimelineUnitsProps) => {
  const zoomToUnit = useCallback(
    ({ start, end }: { start: string | null; end: string | null }) => {
      if (!start || !end) {
        return
      }
      const { newStartClamped, newEndClamped } = clampToAbsoluteBoundaries(
        start,
        end,
        getDeltaMs(start, end),
        absoluteStart,
        absoluteEnd
      )
      onChange(newStartClamped, newEndClamped)
    },
    [absoluteStart, absoluteEnd, onChange]
  )

  const innerDays = getDeltaDays(start, end)

  let baseUnit: DateTimeUnit = 'day'
  if (innerDays > 366) baseUnit = 'year'
  else if (innerDays > 31) baseUnit = 'month'
  else if (innerDays <= 1) baseUnit = 'hour'

  const units = getUnitsPositions(
    outerScale,
    outerStart,
    outerEnd,
    absoluteStart,
    absoluteEnd,
    baseUnit,
    labels,
    locale
  )

  return (
    <div>
      {units.map((d) => {
        if (!d.x || !d.width) {
          return null
        }
        return (
          <div
            key={d.id}
            style={{
              left: d.x,
              width: d.width,
              transition: 'none',
            }}
            className={styles.unit}
          >
            {baseUnit === 'hour' ? (
              <div>{d.label}</div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  zoomToUnit(d)
                }}
                title={d.hoverLabel}
              >
                {d.label}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default TimelineUnits
