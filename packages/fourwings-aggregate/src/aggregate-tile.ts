import {
  FEATURE_ROW_INDEX,
  FEATURE_COL_INDEX,
  FEATURE_CELLS_START_INDEX,
  CELL_NUM_INDEX,
  CELL_START_INDEX,
  CELL_END_INDEX,
  CELL_VALUES_START_INDEX,
  VALUE_MULTIPLIER,
} from './constants'

const getLastDigit = (num: number) => parseInt(num.toString().slice(-1))
// In order for setFeatureState to work correctly, generate unique IDs across viewport-visible tiles:
// concatenate last x/z digits and cell increment index (goal is to get numbers as small as possible)
const generateUniqueId = (x: number, y: number, cellId: number) =>
  parseInt([getLastDigit(x), getLastDigit(y), cellId].join(''))

const getCellCoords = (tileBBox: any, cell: number, numCols: number) => {
  const col = cell % numCols
  const row = Math.floor(cell / numCols)
  const [minX, minY, maxX, maxY] = tileBBox
  const width = maxX - minX
  const height = maxY - minY
  return {
    col,
    row,
    width,
    height,
  }
}

const getPointFeature = (
  tileBBox: any,
  cell: number,
  numCols: number,
  numRows: number,
  addMeta: boolean
): any => {
  const [minX, minY] = tileBBox
  const { col, row, width, height } = getCellCoords(tileBBox, cell, numCols)

  const pointMinX = minX + (col / numCols) * width
  const pointMinY = minY + (row / numRows) * height

  const properties = addMeta
    ? {
        _col: col,
        _row: row,
      }
    : {}

  return {
    type: 'Feature',
    properties,
    geometry: {
      type: 'Point',
      coordinates: [pointMinX, pointMinY],
    },
  }
}

const getRectangleFeature = (
  tileBBox: any,
  cell: number,
  numCols: number,
  numRows: number,
  addMeta: boolean
): any => {
  const [minX, minY] = tileBBox
  const { col, row, width, height } = getCellCoords(tileBBox, cell, numCols)

  const squareMinX = minX + (col / numCols) * width
  const squareMinY = minY + (row / numRows) * height
  const squareMaxX = minX + ((col + 1) / numCols) * width
  const squareMaxY = minY + ((row + 1) / numRows) * height

  const properties = addMeta
    ? {
        _col: col,
        _row: row,
      }
    : {}

  return {
    type: 'Feature',
    properties,
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [squareMinX, squareMinY],
          [squareMaxX, squareMinY],
          [squareMaxX, squareMaxY],
          [squareMinX, squareMaxY],
          [squareMinX, squareMinY],
        ],
      ],
    },
  }
}

const getFeature = ({
  geomType,
  tileBBox,
  cell,
  numCols,
  numRows,
  id,
  addMeta,
}: {
  geomType: string
  tileBBox: any
  cell: number
  numCols: number
  numRows: number
  id: string
  addMeta: boolean
}) => {
  const feature =
    geomType === 'point'
      ? getPointFeature(tileBBox, cell, numCols, numRows, addMeta)
      : getRectangleFeature(tileBBox, cell, numCols, numRows, addMeta)

  feature.id = id

  return feature
}

const writeValueToFeature = (
  quantizedTail: number,
  valueToWrite: string | number,
  feature: any
) => {
  const propertiesKey = quantizedTail.toString()
  if (valueToWrite !== undefined) feature.properties[propertiesKey] = valueToWrite
}

// Given breaks [[0, 10, 20, 30], [-15, -5, 0, 5, 15]]:
//
//                                    |   |   |   |   |
//  if first dataset selected     [   0, 10, 20, 30  ]
//    index returned is:            0 | 1 | 2 | 3 | 4 |
//                                    |   |   |   |   |
//                                    |
// Note: if value is EXACTLY 0, feature is entirely omitted
//                                    |
//                                    |
//                                undefined
//
//  if 2nd dataset selected       [ -15, -5,  0,  5, 15]
//    index returned is:            0 | 1 | 2 | 3 | 4 | 5
//                                    |   |   |   |   |
//                                            |
// Note: if value is EXACTLY 0, feature is entirely omitted
//                                            |
//                                            |
//                                       undefined
//
const getBucketIndex = (breaks: number[], value: number) => {
  let currentBucketIndex
  for (let bucketIndex = 0; bucketIndex < breaks.length + 1; bucketIndex++) {
    const stopValue =
      breaks[bucketIndex] !== undefined ? breaks[bucketIndex] : Number.POSITIVE_INFINITY
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

const getAddValue = (realValuesSum: number, breaks: number[][]) => {
  if (realValuesSum === 0) return undefined
  return breaks ? getBucketIndex(breaks[0], realValuesSum) : realValuesSum
}

const getCompareValue = (
  datasetsHighestRealValue: number,
  datasetsHighestRealValueIndex: number,
  breaks: number[][]
) => {
  if (datasetsHighestRealValue === 0) return undefined
  if (breaks) {
    // offset each dataset by 10 + add actual bucket value
    return (
      datasetsHighestRealValueIndex * 10 +
      getBucketIndex(breaks[datasetsHighestRealValueIndex], datasetsHighestRealValue)
    )
  } else {
    // only useful for debug
    return `${datasetsHighestRealValueIndex};${datasetsHighestRealValue}`
  }
}

const getBivariateValue = (realValues: number[], breaks: number[][]) => {
  if (realValues[0] === 0 && realValues[1] === 0) return undefined
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
  } else {
    // only useful for debug
    return `${realValues[0]};${realValues[1]}`
  }
}

const getLiteralValues = (realValues: number[], numDatasets: number) => {
  if (numDatasets === 1) return realValues
  return `[${realValues.join(',')}]`
}

const getCumulativeValue = (realValuesSum: number, cumulativeValuesPaddedStrings: string[]) => {
  if (realValuesSum === 0) return undefined
  return cumulativeValuesPaddedStrings.join('')
}

const aggregate = (intArray: number[], options: any) => {
  const {
    quantizeOffset = 0,
    tileBBox,
    delta = 30,
    geomType = 'rectangle',
    singleFrame,
    interactive,
    breaks,
    x,
    y,
    z,
    numDatasets,
    combinationMode,
    visible,
  } = options

  if (
    breaks &&
    breaks.length !== numDatasets &&
    (combinationMode === 'compare' || combinationMode === 'bivariate')
  ) {
    throw new Error(
      'must provide as many breaks arrays as number of datasets when using compare and bivariate modes'
    )
  }
  if (breaks && breaks.length !== 1 && combinationMode === 'add') {
    throw new Error('add combinationMode requires one and only one breaks array')
  }
  if (combinationMode === 'bivariate') {
    if (numDatasets !== 2)
      throw new Error('bivariate combinationMode requires exactly two datasets')
    if (breaks) {
      if (breaks.length !== 2)
        throw new Error('bivariate combinationMode requires exactly two breaks array')
      if (breaks[0].length !== breaks[1].length)
        throw new Error('bivariate breaks arrays must have the same length')
      // TODO This might change if we want bivariate with more or less than 16 classes
      if (breaks[0].length !== 4 || breaks[1].length !== 4)
        throw new Error('each bivariate breaks array require exactly 4 values')
    }
  }

  const features = []
  const featuresInteractive = []

  let aggregating = Array(numDatasets).fill([])
  let currentAggregatedValues = Array(numDatasets).fill(0)

  let currentFeature
  let currentFeatureInteractive
  let currentFeatureCell
  let currentFeatureMinTimestamp
  let currentFeatureMaxTimestamp
  let featureBufferValuesPos = 0
  let head
  let tail

  let datasetsHighestRealValue = Number.NEGATIVE_INFINITY
  let datasetsHighestRealValueIndex
  let realValuesSum = 0
  let literalValuesStr = '['
  let cumulativeValuesPaddedStrings = []

  const numRows = intArray[FEATURE_ROW_INDEX]
  const numCols = intArray[FEATURE_COL_INDEX]

  const featureIntArrays = []
  let cellNum
  let startOffset
  let endOffset
  let start
  let end
  let indexInCell = 0

  for (let i = FEATURE_CELLS_START_INDEX; i < intArray.length; i++) {
    const value = intArray[i]
    if (indexInCell === CELL_NUM_INDEX) {
      start = i
      cellNum = value
    } else if (indexInCell === CELL_START_INDEX) {
      startOffset = value
    } else if (indexInCell === CELL_END_INDEX) {
      endOffset = value
      end =
        (start as number) +
        CELL_VALUES_START_INDEX +
        (endOffset - (startOffset as number) + 1) * numDatasets
    }
    indexInCell++
    if (i === (end as number) - 1) {
      indexInCell = 0
      const original = intArray.slice(start, (end as number) + 1)
      const padded = new Array(delta * numDatasets).fill(0)
      original[FEATURE_CELLS_START_INDEX] = endOffset + delta
      const merged = original.concat(padded)
      featureIntArrays.push(merged)
    }
  }

  // const t = performance.now()
  // console.log(x, y, z, intArray)

  if (singleFrame) {
    for (let i = 2; i < intArray.length; i++) {
      const value = intArray[i]
      if (i % 2 === 0) {
        currentFeatureCell = value
      } else {
        const uniqueId = generateUniqueId(x, y, currentFeatureCell as number)
        const featureParams = {
          geomType,
          tileBBox,
          cell: currentFeatureCell,
          numCols,
          numRows,
          id: uniqueId,
        }
        currentFeature = getFeature(featureParams as any)
        currentFeature.properties.value = value / VALUE_MULTIPLIER
        features.push(currentFeature)
      }
    }
  } else {
    for (let f = 0; f < featureIntArrays.length; f++) {
      const featureIntArray = featureIntArrays[f]
      currentFeatureCell = featureIntArray[CELL_NUM_INDEX]
      currentFeatureMinTimestamp = featureIntArray[CELL_START_INDEX]
      currentFeatureMaxTimestamp = featureIntArray[CELL_END_INDEX]
      head = currentFeatureMinTimestamp
      const uniqueId = generateUniqueId(x, y, currentFeatureCell)
      const featureParams = {
        geomType,
        tileBBox,
        cell: currentFeatureCell,
        numCols,
        numRows,
        id: uniqueId,
        addMeta: true,
      }
      currentFeature = getFeature(featureParams as any)
      if (interactive) {
        currentFeatureInteractive = getFeature({ ...featureParams, addMeta: true } as any)
      }

      if (currentFeature.properties._col === 48 && currentFeature.properties._row === 70) {
        // console.log(featureIntArray)
        // console.log(value, realValueAtFrameForDataset, datasetsHighestRealValue)
        // console.log(head, tail, quantizedTail, value, realValueAtFrameForDataset)
      }

      for (let i = 3; i < featureIntArray.length; i++) {
        const value = featureIntArray[i]

        // when we are looking at ts 0 and delta is 10, we are in fact looking at the aggregation of day -9
        tail = head - delta + 1

        // gets index of dataset, knowing that after headers values go
        // dataset1, dataset2, dataset1, dataset2, ...
        const datasetIndex = featureBufferValuesPos % numDatasets

        // collect value for this dataset
        aggregating[datasetIndex].push(value)

        let tailValue = 0
        if (tail > currentFeatureMinTimestamp) {
          tailValue = aggregating[datasetIndex].shift()
        }

        // collect "working" value, ie value at head by substracting tail value
        let realValueAtFrameForDataset = 0
        if (visible[datasetIndex]) {
          realValueAtFrameForDataset = currentAggregatedValues[datasetIndex] + value - tailValue
        }
        currentAggregatedValues[datasetIndex] = realValueAtFrameForDataset

        // Compute mode-specific values
        if (combinationMode === 'compare') {
          if (realValueAtFrameForDataset > datasetsHighestRealValue) {
            datasetsHighestRealValue = realValueAtFrameForDataset
            datasetsHighestRealValueIndex = datasetIndex
          }
        }
        if (combinationMode === 'add' || combinationMode === 'cumulative') {
          realValuesSum += realValueAtFrameForDataset
        }
        if (combinationMode === 'cumulative') {
          const cumulativeValuePaddedString = Math.round(realValuesSum).toString().padStart(6, '0')
          cumulativeValuesPaddedStrings.push(cumulativeValuePaddedString)
        }
        if (combinationMode === 'literal') {
          // literalValuesStr += Math.floor(realValueAtFrameForDataset * 100) / 100
          // Just rounding is faster - revise if decimals are needed
          // Use ceil to avoid values being 'mute' when very close to zero
          // Update: use .round to avoid discrepancies betwen interaction and total ammount
          literalValuesStr += Math.round(realValueAtFrameForDataset)
          if (datasetIndex < numDatasets - 1) {
            literalValuesStr += ','
          }
        }

        const quantizedTail = tail - quantizeOffset

        if (quantizedTail >= 0 && datasetIndex === numDatasets - 1) {
          let finalValue

          if (combinationMode === 'literal') {
            literalValuesStr += ']'
          }
          // TODO add 'single' mode
          if (combinationMode === 'compare') {
            finalValue = getCompareValue(
              datasetsHighestRealValue,
              datasetsHighestRealValueIndex as number,
              breaks
            )
          } else if (combinationMode === 'add') {
            finalValue = getAddValue(realValuesSum, breaks)
          } else if (combinationMode === 'bivariate') {
            finalValue = getBivariateValue(currentAggregatedValues, breaks)
          } else if (combinationMode === 'literal') {
            finalValue = literalValuesStr
          } else if (combinationMode === 'cumulative') {
            finalValue = getCumulativeValue(realValuesSum, cumulativeValuesPaddedStrings)
          }
          // console.log(quantizedTail, finalValue, currentFeature)
          writeValueToFeature(quantizedTail, finalValue as string | number, currentFeature)
        }

        if (datasetIndex === numDatasets - 1) {
          // When all dataset values have been collected for this frame, we can move to next frame
          head++

          // Reset mode-specific values when last dataset
          datasetsHighestRealValue = Number.NEGATIVE_INFINITY
          realValuesSum = 0
          cumulativeValuesPaddedStrings = []
          literalValuesStr = '['
        }

        featureBufferValuesPos++
      }

      features.push(currentFeature)
      if (interactive) {
        currentFeatureInteractive.properties.rawValues = featureIntArray
        featuresInteractive.push(currentFeatureInteractive)
      }

      featureBufferValuesPos = 0

      datasetsHighestRealValue = Number.NEGATIVE_INFINITY
      realValuesSum = 0
      cumulativeValuesPaddedStrings = []

      aggregating = Array(numDatasets).fill([])
      currentAggregatedValues = Array(numDatasets).fill(0)

      continue
    }
  }
  // console.log(performance.now()- t)
  const geoJSONs: any = {
    main: {
      type: 'FeatureCollection',
      features,
    },
  }
  if (interactive) {
    geoJSONs.interactive = {
      type: 'FeatureCollection',
      features: featuresInteractive,
    }
  }
  return geoJSONs
}

export default aggregate
