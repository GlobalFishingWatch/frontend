import Pbf from 'pbf'
import {
  CELL_END_INDEX,
  CELL_NUM_INDEX,
  CELL_START_INDEX,
  CELL_VALUES_START_INDEX,
  FEATURE_CELLS_START_INDEX,
} from './constants'

const MULTIPLIER = 100

export const fourWingsLoader = (minFrame, maxFrame) => ({
  name: '4Wings',
  id: '4Wings-pbf',
  version: 'latest',
  extensions: ['pbf'],
  mimeTypes: ['application/x-protobuf', 'application/octet-stream'],
  worker: false,
  parse: async (arrayBuffer) => parseFourWings(arrayBuffer, minFrame, maxFrame),
  parseSync: async (arrayBuffer) => parseFourWings(arrayBuffer, minFrame, maxFrame),
})

function readData(_, data, pbf) {
  data.push(pbf.readPackedVarint())
}

const parseFourWings = (arrayBuffer, minFrame, maxFrame) => {
  // read
  var data = new Pbf(arrayBuffer).readFields(readData, [])[0]
  const cells = getCellArrays(data, 1).cells
  const rows = data[0]
  const cols = data[1]
  console.log('rows', rows, 'cols', cols)
  console.log('cells', rows * cols, 'cells with data', cells.length)
  let allCells = new Array(rows * cols).fill({})
  for (let i = 0; i < allCells.length; i++) {
    const cellInTile = cells.find((c) => c.cellNum === i)
    if (cellInTile) allCells[i] = cellInTile
  }
  const framesInCell = allCells.map((cell) => {
    if (!cell.timeseries) return []
    const cells = cell.timeseries.filter(
      (tsFrame) => tsFrame.frame >= minFrame && tsFrame.frame <= maxFrame
    )
    return cells.length >= 1 ? cells : []
  })
  const timeseries = framesInCell
    ? framesInCell.map((cell) => cell.map((tsFrame) => tsFrame.value))
    : []
  console.log(`Timeseries from ${getDate(minFrame)} to ${getDate(maxFrame)}`, timeseries)

  const aggregatedValues = framesInCell
    ? framesInCell.map((cell) => cell.reduce((prev, curr) => prev + curr.value, 0))
    : 0
  console.log(
    `Aggregated value from ${getDate(minFrame)} to ${getDate(maxFrame)}`,
    aggregatedValues
  )

  const colStep = 360 / cols
  const rowStep = 170 / rows

  if (aggregatedValues) {
    return aggregatedValues.map((value, index) => {
      return {
        centroid: [
          -180 + colStep * (index % cols) + colStep / 2,
          -85 + rowStep * Math.floor(index / cols) + rowStep / 2,
        ],
        value: value / MULTIPLIER,
      }
    })
  }
}

const getDate = (day) => {
  return new Date(day * 1000 * 60 * 60 * 24).toDateString()
}

const getCellArrays = (intArray, sublayerCount = 1) => {
  const cells = []
  let cellNum = 0
  let startFrame = 0
  let endFrame = 0
  let startIndex = 0
  let endIndex = 0
  let indexInCell = 0
  const domainX = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
  const domainY = [0, Number.NEGATIVE_INFINITY]
  for (let i = FEATURE_CELLS_START_INDEX; i < intArray.length; i++) {
    const value = intArray[i]
    if (indexInCell === CELL_NUM_INDEX) {
      startIndex = i
      cellNum = value
    } else if (indexInCell === CELL_START_INDEX) {
      startFrame = value
    } else if (indexInCell === CELL_END_INDEX) {
      endFrame = value
      endIndex = startIndex + CELL_VALUES_START_INDEX + (endFrame - startFrame + 1) * sublayerCount
    }
    indexInCell++
    if (i === endIndex - 1) {
      indexInCell = 0
      const original = intArray.slice(startIndex, endIndex)
      // const padded = new Array(delta * sublayerCount).fill(padValue)
      // original[FEATURE_CELLS_START_INDEX] = endFrame + delta
      // const merged = original.concat(padded)
      const values = intArray.slice(startIndex + CELL_VALUES_START_INDEX, endIndex)
      // eslint-disable-next-line
      const timeseries = values.map((v, i) => ({
        value: v,
        frame: i + startFrame,
      }))
      cells.push({
        rawCell: original,
        values,
        timeseries,
        cellNum,
        startFrame,
        endFrame,
      })
      if (startFrame < domainX[0]) domainX[0] = startFrame
      if (endFrame > domainX[1]) domainX[1] = endFrame
      const cellMaxValue = Math.max(...values)
      if (cellMaxValue > domainY[1]) domainY[1] = cellMaxValue
    }
  }
  return {
    domainX,
    domainY,
    cells,
  }
}
