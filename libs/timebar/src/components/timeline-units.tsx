// @ts-nocheck

import React, { PureComponent } from 'react'
import { getUnitsPositions } from '../layouts'
import { clampToAbsoluteBoundaries, getDeltaMs, getDeltaDays } from '../utils/internal-utils'
import styles from './timeline-units.module.css'

type TimelineUnitsProps = {
  labels?: {
    zoomTo?: string
    day?: string
    year?: string
    month?: string
    hour?: string
  }
  onChange: (...args: unknown[]) => unknown
  start: string
  end: string
  absoluteStart: string
  absoluteEnd: string
  outerStart: string
  outerEnd: string
  outerScale: (...args: unknown[]) => unknown
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

  zoomToUnit({ start, end }) {
    const { absoluteStart, absoluteEnd } = this.props
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
    } = this.props

    const innerDays = getDeltaDays(start, end)

    let baseUnit = 'day'
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
      labels
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
