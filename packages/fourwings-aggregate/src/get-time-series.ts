import { CELL_VALUES_START_INDEX } from './constants'
import { getCellValues } from './util'

type Feature = {
  properties: {
    rawValues: string
  }
}

const getTimeSeries = (features: Feature[], numSublayers: number, quantizeOffset = 0) => {
  if (!features || !features.length) {
    return []
  }

  let minFrame = Number.POSITIVE_INFINITY
  let maxFrame = Number.NEGATIVE_INFINITY

  const valuesByFrame: number[][] = []

  features.forEach((feature) => {
    const rawValues: string = feature.properties.rawValues
    const { values, minCellOffset, maxCellOffset } = getCellValues(rawValues)
    if (minCellOffset < minFrame) minFrame = minCellOffset
    if (maxCellOffset > maxFrame) maxFrame = maxCellOffset
    let currentFrameIndex = minCellOffset - quantizeOffset
    for (let i = CELL_VALUES_START_INDEX; i < values.length; i++) {
      const sublayerIndex = (i - CELL_VALUES_START_INDEX) % numSublayers
      const rawValue = values[i]
      if (!valuesByFrame[currentFrameIndex]) {
        valuesByFrame[currentFrameIndex] = new Array(numSublayers).fill(0)
      }
      valuesByFrame[currentFrameIndex][sublayerIndex] += rawValue

      if (sublayerIndex === numSublayers - 1) {
        currentFrameIndex++
      }
    }
  })

  const numValues = maxFrame - minFrame
  const finalValues = new Array(numValues)
  for (let i = 0; i <= numValues; i++) {
    const frame = minFrame + i
    finalValues[i] = {
      frame,
      ...valuesByFrame[frame - quantizeOffset],
    }
  }

  return finalValues
}

export default getTimeSeries
