import React, { PureComponent } from 'react'
import type { DateTimeUnit } from 'luxon'

import { getUnitsPositions } from '../layouts'
import type { TimelineScale } from '../timelineContext'
import { clampToAbsoluteBoundaries, getDeltaDays,getDeltaMs } from '../utils/internal-utils'

import styles from './timeline-units.module.css'

type TimelineUnitsProps = {
  labels?: {
    zoomTo?: string
    day?: string
    year?: string
    month?: string
    hour?: string
  }
  onChange: (start: string, end: string, source?: string, clampToEnd?: boolean) => void
  start: string
  end: string
  absoluteStart: string
  absoluteEnd: string
  outerStart: string
  outerEnd: string
  outerScale: TimelineScale
  locale: string
}

class TimelineUnits extends PureComponent<TimelineUnitsProps> {
  static defaultProps = {
    labels: {
      zoomTo: 'Zoom to',
      day: 'day',
      year: 'year',
      month: 'month',
      hour: 'hour',
    },
  }

  zoomToUnit({ start, end }: { start: string | null; end: string | null }) {
    const { absoluteStart, absoluteEnd } = this.props
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
    this.props.onChange(newStartClamped, newEndClamped)
  }

  render() {
    const {
      labels = {},
      start,
      end,
      absoluteStart,
      absoluteEnd,
      outerScale,
      outerStart,
      outerEnd,
      locale,
    } = this.props

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
        {units.map((d) => (
          <div
            key={d.id}
            style={{
              left: d.x,
              width: d.width,
              transition: 'none',
              // transition: immediate
              //   ? 'none'
              //   : `width ${DEFAULT_CSS_TRANSITION}, left ${DEFAULT_CSS_TRANSITION}`,
            }}
            className={styles.unit}
          >
            {baseUnit === 'hour' ? (
              <div>{d.label}</div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  this.zoomToUnit(d)
                }}
                title={d.hoverLabel}
              >
                {d.label}
              </button>
            )}
          </div>
        ))}
      </div>
    )
  }
}

export default TimelineUnits
