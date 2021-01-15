import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { area, stack, curveStepAfter } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import ImmediateContext from '../immediateContext'
import { DEFAULT_CSS_TRANSITION } from '../constants'
import { TimelineContext } from '../components/timeline'

const getPathContainers = (data, graphHeight, overallScale, numSublayers) => {
  if (!data) return []

  const stackLayout = stack().keys(Array.from(Array(numSublayers).keys()))

  const series = stackLayout(data)

  const y = scaleLinear()
    .domain([0, max(series, (d) => max(d, (d) => d[1]))])
    .nice()
    .range([10, graphHeight - 10])

  const areaLayout = area()
    .x((d) => {
      if (!d.data) {
        console.log(d)
        return
      }
      return overallScale(d.data.date)
    })
    .y0((d) => y(d[0]))
    .y1((d) => y(d[1]))
    .curve(curveStepAfter)

  const layouted = series.map((s) => {
    return {
      path: areaLayout(s),
    }
  })

  return layouted
}

const StackedActivity = ({ data, colors, numSublayers }) => {
  const { immediate } = useContext(ImmediateContext)
  const { overallScale, outerWidth, graphHeight, svgTransform } = useContext(TimelineContext)

  const pathContainers = useMemo(() => {
    return getPathContainers(data, graphHeight, overallScale, numSublayers)
  }, [data, graphHeight, overallScale, numSublayers])

  return (
    <svg width={outerWidth} height={graphHeight}>
      <g
        transform={svgTransform}
        style={{
          transition: immediate ? 'none' : `transform ${DEFAULT_CSS_TRANSITION}`,
        }}
      >
        {pathContainers.map((pathContainer, sublayerIndex) => (
          <path
            key={sublayerIndex}
            d={pathContainer.path}
            fill={colors ? colors[sublayerIndex] : '#ff00ff'}
            // fillOpacity={opacity}
          />
        ))}
      </g>
    </svg>
  )
}

StackedActivity.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.number,
      sublayers: PropTypes.arrayOf(PropTypes.number),
    })
  ).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  numSublayers: PropTypes.number.isRequired,
}

StackedActivity.defaultProps = {
  data: [],
  colors: [],
  numSublayers: 0,
}
export default StackedActivity
