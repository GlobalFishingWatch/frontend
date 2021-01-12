import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  area,
  stack,
  curveStepAfter,
  curveStepBefore,
  curveLinear,
  curveBasis,
  curveCatmullRom,
  curveCardinal,
} from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import ImmediateContext from '../immediateContext'
import { DEFAULT_CSS_TRANSITION } from '../constants'
import { TimelineContext } from '../components/timeline'

// const getPaths = (activity, graphHeight, overallScale, maxValue, curve, mode = 'mirror') => {
//   const finalHeight = graphHeight - TOP_MARGIN - BOTTOM_MARGIN
//   const middle = Math.round(TOP_MARGIN + finalHeight / 2)

//   const minHeight = mode === 'mirror' ? MIN_HEIGHT / 2 : MIN_HEIGHT
//   const valuePx = (d) => minHeight + (finalHeight * d.value) / maxValue / 2

//   const areaGenerator = area()
//     .x((d) => overallScale(d.date))
//     .y0(mode === 'mirror' || mode === 'up' ? (d) => middle - valuePx(d) : middle)
//     .y1(mode === 'mirror' || mode === 'down' ? (d) => middle + valuePx(d) : middle)
//     .curve(CURVES[curve])

//   const paths = activity.map((segment, i) => {
//     // console.log(segment.find(p => p.value === null))
//     return areaGenerator(segment)
//   })

//   return paths
// }

const getPathContainers = (data, graphHeight, overallScale) => {
  if (!data) return []

  const stackLayout = stack()
    // TODO
    .keys([0, 1, 2])

  // TODO this breaks when arrays are not continuous ie when zoomed in a lot
  const series = stackLayout(data)
  console.log(series)

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
  console.log(layouted)

  return layouted

  // return graphTracks.map((graphTrack, i) => {
  //   if (!graphTrack)
  //     return {
  //       paths: [],
  //     }
  //   return {
  //     paths: getPaths(
  //       graphTrack.segmentsWithCurrentFeature,
  //       graphHeight,
  //       overallScale,
  //       maxValues[i],
  //       curve,
  //       graphTracks.length === 1 ? 'mirror' : i === 0 ? 'up' : 'down'
  //     ),
  //     color: graphTrack.color,
  //   }
  // })
}

const StackedActivity = ({ data, colors }) => {
  const { immediate } = useContext(ImmediateContext)
  const { overallScale, outerWidth, graphHeight, svgTransform } = useContext(TimelineContext)

  // const maxValues = useMemo(() => {
  //   return getMaxValues(graphTracks)
  // }, [graphTracks])

  const pathContainers = useMemo(() => {
    return getPathContainers(data, graphHeight, overallScale)
  }, [data, graphHeight, overallScale])

  console.log(pathContainers)
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
  ),
  colors: PropTypes.arrayOf(PropTypes.string),
}

StackedActivity.defaultProps = {
  data: [],
  colors: [],
}

export default StackedActivity
