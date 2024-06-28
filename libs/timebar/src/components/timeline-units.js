import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { getUnitsPositions } from '../layouts'
import { clampToAbsoluteBoundaries, getDeltaMs, getDeltaDays } from '../utils/internal-utils'
import styles from './timeline-units.module.css'

class TimelineUnits extends PureComponent {
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

TimelineUnits.propTypes = {
  labels: PropTypes.shape({
    zoomTo: PropTypes.string,
    day: PropTypes.string,
    year: PropTypes.string,
    month: PropTypes.string,
    hour: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  absoluteStart: PropTypes.string.isRequired,
  absoluteEnd: PropTypes.string.isRequired,
  outerStart: PropTypes.string.isRequired,
  outerEnd: PropTypes.string.isRequired,
  outerScale: PropTypes.func.isRequired,
}

TimelineUnits.defaultProps = {
  labels: {
    zoomTo: 'Zoom to',
    day: 'day',
    year: 'year',
    month: 'month',
    hour: 'hour',
  },
}

export default TimelineUnits
