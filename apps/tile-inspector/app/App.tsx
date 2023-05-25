import React, { Fragment, useCallback, useState } from 'react'
import { LineChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import { DateTime } from 'luxon'
import { InputText, Button } from '@globalfishingwatch/ui-components'
import {
  CELL_END_INDEX,
  CELL_NUM_INDEX,
  CELL_START_INDEX,
  CELL_VALUES_START_INDEX,
  FEATURE_CELLS_START_INDEX,
  FEATURE_COL_INDEX,
  FEATURE_ROW_INDEX,
} from '@globalfishingwatch/fourwings-aggregate'
import { Interval, CONFIG_BY_INTERVAL } from '@globalfishingwatch/layer-composer'
import { GFWAPI } from '@globalfishingwatch/api-client'
import decodePBF from './decodePbf'
import LineCanvas from './LineCanvas'

type Meta = {
  rows: number
  cols: number
  domainX: number[]
  domainY: number[]
  interval: Interval
}

type CellsWrapper = {
  cells: Cell[]
  domainX: number[]
  domainY: number[]
}

export type Cell = {
  rawCell: number[]
  values: number[]
  timeseries: { frame: number; value: number }[]
  cellNum: number
  startFrame: number
  endFrame: number
}

const getCellArrays = (intArray: number[], sublayerCount = 1): CellsWrapper => {
  const cells: Cell[] = []
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

const RECHART_PADDING = {
  top: 5,
  bottom: 38,
  left: 66,
  right: 5,
}

const W = 20000
const H = 800

function App(): React.ReactElement {
  const [tileURL, setTileURL] = useState(
    'https://gateway.api.dev.globalfishingwatch.org/v1/4wings/tile/heatmap/1/1/0?proxy=true&format=intArray&temporal-aggregation=false&interval=10days&datasets[0]=public-global-fishing-effort:v20201001&datasets[1]=public-bra-onyxsat-fishing-effort:v20211126,public-chile-fishing-effort:v20211126,public-ecuador-fishing-effort:v20211126,public-indonesia-fishing-effort:v20200320,public-panama-fishing-effort:v20211126,public-peru-fishing-effort:v20211126'
  )
  const [numSublayers, setNumSublayers] = useState(1)

  const [meta, setMeta] = useState<Meta | null>(null)
  const [cells, setCells] = useState<CellsWrapper>({
    domainX: [0, 1],
    domainY: [0, 1],
    cells: [],
  })
  const [currentPt, setCurrentPt] = useState(null)

  const loadTile = useCallback(() => {
    GFWAPI.fetch(tileURL, { responseType: 'arrayBuffer' }).then((buffer) => {
      const url = new URL(tileURL)
      const interval = url.searchParams.get('interval') as Interval
      const intArray = decodePBF(buffer)
      const cells = getCellArrays(intArray, numSublayers)
      setMeta({
        rows: intArray[FEATURE_ROW_INDEX],
        cols: intArray[FEATURE_COL_INDEX],
        domainX: cells.domainX,
        domainY: cells.domainY,
        interval,
      })
      setCells(cells)
    })
  }, [tileURL, numSublayers])

  const dateTickFormatter = useCallback(
    (value: any, index: number) => {
      if (!meta?.interval) return '??'
      const getDate = CONFIG_BY_INTERVAL[meta.interval].getDate
      return DateTime.fromJSDate(getDate(value)).toLocaleString(DateTime.DATE_SHORT)
    },
    [meta]
  )

  const onLineCanvasClick = useCallback((pt: any) => {
    setCurrentPt(pt)
  }, [])

  return (
    <Fragment>
      <InputText
        inputSize="small"
        value={tileURL}
        label="Tile URL"
        onChange={(e) => setTileURL(e.target.value)}
      />
      <InputText
        inputSize="small"
        value={numSublayers}
        label="Num sublayers"
        onChange={(e) => setNumSublayers(parseInt(e.target.value))}
      />
      <Button onClick={loadTile}>Load tile</Button>
      {meta && (
        <ul>
          <li>rows: {meta.rows}</li>
          <li>cols: {meta.cols}</li>
          <li>domainX: {meta.domainX.toString()}</li>
          <li>domainY: {meta.domainY.toString()}</li>
          <li>interval: {meta.interval}</li>
        </ul>
      )}

      <div>Clicked: {currentPt && (currentPt as any).cellNum}</div>

      <div style={{ position: 'relative' }}>
        <LineChart
          width={W + RECHART_PADDING.left + RECHART_PADDING.right}
          height={H + RECHART_PADDING.top + RECHART_PADDING.bottom}
          data={cells.cells}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="frame"
            type="number"
            domain={cells.domainX}
            tickCount={999}
            allowDecimals={false}
            minTickGap={0}
          />
          {meta && meta.interval && (
            <XAxis
              dataKey="frame"
              type="number"
              domain={cells.domainX}
              tickCount={999}
              allowDecimals={false}
              minTickGap={0}
              xAxisId="plop"
              axisLine={false}
              tickFormatter={dateTickFormatter}
            />
          )}
          <YAxis dataKey="value" type="number" domain={cells.domainY} reversed={true} />
        </LineChart>

        <div style={{ position: 'absolute', top: RECHART_PADDING.top, left: RECHART_PADDING.left }}>
          <LineCanvas
            width={W}
            height={H}
            data={cells.cells}
            domainX={cells.domainX}
            domainY={cells.domainY}
            onClick={onLineCanvasClick}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default App
