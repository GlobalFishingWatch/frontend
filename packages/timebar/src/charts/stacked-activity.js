import React, { Fragment, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { area, stack, stackOffsetSilhouette, stackOrderAscending, curveStepAfter } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import ImmediateContext from '../immediateContext'
import { DEFAULT_CSS_TRANSITION } from '../constants'
import { TimelineContext } from '../components/timeline'

const MARGIN_BOTTOM = 20
const MARGIN_TOP = 5

const getPathContainers = (data, graphHeight, overallScale, numSublayers) => {
  if (!data) return []

  const stackLayout = stack()
    .keys(Array.from(Array(numSublayers).keys()))
    .offset(stackOffsetSilhouette)
    .order(stackOrderAscending)

  const series = stackLayout(data)

  const y = scaleLinear()
    .domain([0, max(series, (d) => max(d, (d) => d[1]))])
    .range([MARGIN_TOP, graphHeight / 2 - MARGIN_BOTTOM / 2])

  const areaLayout = area()
    .x((d) => overallScale(d.data.date))
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

  const middleY = graphHeight / 2 - MARGIN_BOTTOM / 2

  return (
    <svg width={outerWidth} height={graphHeight}>
      <g
        transform={svgTransform}
        style={{
          transition: immediate ? 'none' : `transform ${DEFAULT_CSS_TRANSITION}`,
        }}
      >
        {pathContainers.map((pathContainer, sublayerIndex) => (
          <g key={sublayerIndex} transform={`translate(0, ${middleY})`}>
            <path d={pathContainer.path} fill={colors ? colors[sublayerIndex] : '#ff00ff'} />
          </g>
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
