import React, { memo } from 'react'
import cx from 'classnames'
import styles from './Bivariate.module.css'
import BivariateArrows from './Bivariate-arrows'
import { LegendLayerBivariate, roundLegendNumber, formatLegendValue } from './'

type BivariateLegendProps = {
  layer: LegendLayerBivariate
  roundValues?: boolean
  className?: string
  labelComponent?: React.ReactNode
}

/**
 * ---------------------------------------------------------
 * The following code is copy pasted from the MGL fork
 * TODO find a way to centralize
 */

// Given breaks [[0, 10, 20, 30], [-15, -5, 0, 5, 15]]:
//
//                                    |   |   |   |   |
//  if first dataset selected     [   0, 10, 20, 30  ]
//    index returned is:            0 | 1 | 2 | 3 | 4 |
//                                    |   |   |   |   |
//  if 2nd dataset selected       [ -15, -5,  0,  5, 15]
//    index returned is:            0 | 1 | 2 | 3 | 4 | 5
//                                    |   |   |   |   |
// Note: 0 is a special value, feature is entirely omitted
//                                            |
//                                       undefined
const getBucketIndex = (breaks: number[], value: number) => {
  let currentBucketIndex
  for (let bucketIndex = 0; bucketIndex < breaks.length + 1; bucketIndex++) {
    const stopValue = breaks?.[bucketIndex] ?? Number.POSITIVE_INFINITY
    if (value <= stopValue) {
      currentBucketIndex = bucketIndex
      break
    }
  }
  if (currentBucketIndex === undefined) {
    currentBucketIndex = breaks.length
  }
  return currentBucketIndex
}

const getBivariateValue = (realValues: number[], breaks: number[][]) => {
  if (realValues[0] === 0 && realValues[1] === 0) return 0
  if (breaks) {
    //  y: datasetB
    //
    //   |    0 | 0
    //   |   --(u)--+---+---+---+
    //   |    0 | 1 | 2 | 3 | 4 |
    //   |      +---+---+---+---+
    //   v      | 5 | 6 | 7 | 8 |
    //          +---+---+---+---+
    //          | 9 | 10| 11| 12|
    //          +---+---+---+---+
    //          | 13| 14| 15| 16|
    //          +---+---+---+---+
    //          --------------> x: datasetA
    //
    const valueA = getBucketIndex(breaks[0], realValues[0])
    const valueB = getBucketIndex(breaks[1], realValues[1])
    // || 1: We never want a bucket of 0 - values below first break are not used in bivariate
    const colIndex = (valueA || 1) - 1
    const rowIndex = (valueB || 1) - 1

    const index = rowIndex * 4 + colIndex
    // offset by one because values start at 1 (0 reserved for values < min value)
    return index + 1
  }
}
/**
 * ---------------------------------------------------------
 */

const BivariateRect = ({
  i,
  color,
  className,
}: {
  i: number
  color?: string
  className?: string
}) => {
  return (
    <rect
      className={className}
      fill={color}
      x={20 * ((i - 1) % 4)}
      y={20 * (3 - Math.floor((i - 1) / 4))}
      width="20"
      height="20"
    ></rect>
  )
}

const valuesPositions = [
  [
    { x: '14', y: '68' },
    { x: '28', y: '46' },
    { x: '42', y: '31' },
    { x: '56', y: '15' },
  ],
  [
    { x: '', y: '' }, // Not used
    { x: '28', y: '90' },
    { x: '42', y: '105' },
    { x: '56', y: '120' },
  ],
]

function BivariateLegend({
  layer,
  className,
  labelComponent,
  roundValues = true,
}: BivariateLegendProps) {
  if (!layer || !layer.bivariateRamp || !layer.sublayersBreaks) return null
  const bivariateBucketIndex = getBivariateValue(
    [layer.currentValues[0] || 0, layer.currentValues[1] || 0],
    layer.sublayersBreaks
  )
  return (
    <div className={styles.container}>
      {labelComponent}
      <svg
        className={cx(styles.svg, className)}
        width="184px"
        height="170px"
        viewBox="0 0 184 170"
        version="1.1"
      >
        <g stroke="none" fill="none">
          <g transform="translate(-73, -246)">
            <g>
              <g transform="translate(0, 70)">
                <g transform="translate(93, 176)">
                  <g className={styles.labels}>
                    <BivariateArrows />
                    {valuesPositions.map((positions, xIndex) =>
                      positions?.map(({ x, y }, yIndex) => {
                        if (xIndex === 1 && yIndex === 0) return null
                        const value = layer.sublayersBreaks?.[xIndex]?.[yIndex]
                        const roundedValue = roundValues ? roundLegendNumber(value) : value
                        return (
                          <text key={value}>
                            <tspan x={x} y={y}>
                              {formatLegendValue(roundedValue)}
                            </tspan>
                          </text>
                        )
                      })
                    )}
                  </g>
                  <g transform="translate(81, 62) scale(1, -1) rotate(45) translate(-81, -62) translate(41, 22)">
                    {layer.bivariateRamp.map((color: string, i: number) => (
                      <BivariateRect color={color} i={i} key={color} />
                    ))}
                    {bivariateBucketIndex && bivariateBucketIndex > 0 && (
                      <BivariateRect
                        i={bivariateBucketIndex}
                        key="highlight"
                        className={styles.highlighted}
                      />
                    )}
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}

export default memo(BivariateLegend)
