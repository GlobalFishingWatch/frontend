import React, { Fragment, useMemo, useCallback } from 'react'
import cx from 'classnames'
import { scaleTime } from 'd3-scale'
import countryflag from 'countryflag'
import capitalize from 'lodash/capitalize'
import { addMinutes, subMinutes } from 'date-fns'
import { getUnitsPositions } from '@globalfishingwatch/map-components/components/timebar/layouts'
import CountryFlag from '@globalfishingwatch/ui-components/dist/countryflag'
import { useElementSize } from 'hooks/screen.hooks'
import { formatUTCDate } from 'utils'
import Tooltip from 'components/tooltip/tooltip'
import { TEXT_DATE_FORMAT, EVENT_TYPES, OTHERS_GROUP_KEY } from 'data/constants'
import { EventType, QueryParams } from 'types/app.types'
import TemporalLayout from './layouts/temporal-layout'
import CategoryLayout from './layouts/category-layout'

import './graph-styles.scss'

const HORIZONTAL_PADDING = 7
const VERTICAL_PADDING = 15
const GRAPH_HEIGHT = 240
const TOTAL_HEIGHT = GRAPH_HEIGHT + VERTICAL_PADDING * 2

// order items for circle transitions:
// - updating and leaving first
//    - leaving items are just placeholders, with flag
// - entering items last, with flag
const transitionsSort = (items: any, prevKeys: any, baseItem: any) => {
  let orderedItems = items
  if (prevKeys && prevKeys.length) {
    orderedItems = []
    prevKeys.forEach((prevKey: any) => {
      const index = items.findIndex((item: any) => item.data.id === prevKey)
      if (index > -1) {
        orderedItems.push(items.splice(index, 1)[0])
      } else {
        orderedItems.push({
          ...baseItem,
          x: -100,
          y: -100,
          isOld: true,
        })
      }
    })
    items.forEach((newItem: any) => {
      orderedItems.push({
        ...newItem,
        isNew: true,
      })
    })
  }
  return orderedItems
}

type SortElement = { key: string; count: number; risk: number }
const sort = {
  flag: (a: SortElement, b: SortElement) => {
    if (a.key === OTHERS_GROUP_KEY) return 1
    if (b.key === OTHERS_GROUP_KEY) return -1
    return b.count - a.count
  },
  port: (a: SortElement, b: SortElement) => {
    if (a.key === OTHERS_GROUP_KEY) return 1
    if (b.key === OTHERS_GROUP_KEY) return -1
    return b.count - a.count
  },
  eez: (a: SortElement, b: SortElement) => {
    if (a.key === OTHERS_GROUP_KEY) return 1
    if (b.key === OTHERS_GROUP_KEY) return -1
    return b.count - a.count
  },
  rfmo: (a: SortElement, b: SortElement) => {
    return a.key.localeCompare(b.key)
  },
  unit: (a: SortElement, b: SortElement) => {
    if (a.risk > b.risk) return -1
    if (a.risk < b.risk) return 1
    return 0
  },
}

const toPercentage = (value: number, scale: number) => {
  return `${(value / scale) * 100}%`
}

interface CircleProps {
  item: any
  width: number
  eventType: EventType
  onEventClick: (any: any) => void
}
const Circle: React.FC<CircleProps> = ({ item, width, eventType, onEventClick }) => {
  const { rfmo, t, flag } = item.data || {}

  const tooltip = (
    <div className="circle-tooltip">
      {flag?.id && (
        <p>
          <label>FLAG</label>
          <CountryFlag iso={flag.id} />
        </p>
      )}
      {rfmo && rfmo.lentgh > 0 && (
        <p>
          <label>RFMO</label>
          <span>{rfmo.join(', ')}</span>
        </p>
      )}
      {t && (
        <p className="text-no-wrap">
          <label>TIME</label>
          <span>{formatUTCDate(parseInt(t, 10), `${TEXT_DATE_FORMAT} ha`)}</span>
        </p>
      )}
    </div>
  )

  return (
    <Tooltip content={tooltip}>
      <circle
        cx={toPercentage(item.x, width)}
        cy={item.y}
        r={toPercentage(item.r, width)}
        className={cx({
          partially: item.data && item.data.risk === 2,
          unmatched: item.data && item.data.risk === 3,
          loitering: eventType === EVENT_TYPES.loitering,
          isNew: item.isNew,
        })}
        onClick={() => onEventClick(item)}
      />
    </Tooltip>
  )
}

interface CirclesProps {
  items: any
  width: number
  type: string
  eventType: EventType
  onEventClick: any
}
const Circles: React.FC<CirclesProps> = ({ items, width, type, eventType, onEventClick }) => {
  return items.map((item: any, i: number) => (
    <Circle
      item={item}
      width={width}
      eventType={eventType}
      key={item.data ? item.data.id + i : Math.random()}
      onEventClick={onEventClick}
    />
  ))
}

interface ColumLabelsProps {
  columns: any
  width: number
  type: any
  onLabelClick: any
}
const ColumnLabels: React.FC<ColumLabelsProps> = ({ columns, width, type, onLabelClick }) => {
  return columns.map((column: any) => {
    const isFlag = type === 'flag' && column.key !== OTHERS_GROUP_KEY
    const showTooltip = isFlag || type === 'port' || type === 'eez' || type === 'rfmo'
    let flag = null
    try {
      flag = isFlag ? countryflag(column.key) : null
    } catch (e) {
      console.warn(e)
    }
    const axisLabel = isFlag && flag ? flag.emoji || flag.svg : column.label || column.key

    const content =
      !isFlag || (flag && flag.emoji) ? (
        <text x={toPercentage(column.x + column.width / 2, width)} y={TOTAL_HEIGHT - 20}>
          {axisLabel}
        </text>
      ) : (
        <image
          x={toPercentage(column.x + column.width / 2 - 8, width)}
          y={TOTAL_HEIGHT - 32}
          width="16"
          height="12"
          xlinkHref={axisLabel}
        />
      )
    return (
      <g
        className={cx('axisLabel', { axisLabelDisabled: column.key === OTHERS_GROUP_KEY })}
        key={column.key}
        onClick={() => onLabelClick(type, column)}
      >
        <rect
          height={2}
          width={toPercentage(column.width, width)}
          x={toPercentage(column.x, width)}
          y={TOTAL_HEIGHT - 40}
        />
        {showTooltip ? (
          <Tooltip
            content={
              isFlag && flag
                ? flag.name
                : type === 'rfmo'
                ? column.tooltip
                : capitalize(column.tooltip)
            }
            placement="bottom"
          >
            {content}
          </Tooltip>
        ) : (
          content
        )}
      </g>
    )
  })
}

interface ValueLabelsProps {
  columns: any
  width: number
}
const ValueLabels: React.FC<ValueLabelsProps> = ({ columns, width }) =>
  columns.map((column: any) => (
    <text
      className="valueLabel"
      x={toPercentage(column.x + column.width / 2, width)}
      y={column.y - 5}
      key={`${column.key}-label`}
    >
      {column.count}
    </text>
  ))

interface CategoryColumnsProps {
  columns: any
  width: number
  eventType: string
}
const CategoryColumns: React.FC<CategoryColumnsProps> = ({ columns, width, eventType }) =>
  columns.map((column: any) => (
    <g key={column.key} data-count={column.count} className="categoryColumns">
      {column.count
        ? column.areas.map((area: any, i: number) => (
            <rect
              x={toPercentage(area.x, width)}
              y={area.y0}
              width={toPercentage(area.width, width)}
              height={area.height}
              key={`${area.key}-${i}`}
              className={cx({
                partially: area.risk === 2,
                unmatched: area.risk === 3,
                loitering: eventType === EVENT_TYPES.loitering,
              })}
            />
          ))
        : null}
    </g>
  ))

interface TemporalAreasProps {
  areas: any
  eventType: string
}
const TemporalAreas: React.FC<TemporalAreasProps> = ({ areas, eventType }) => {
  return (
    <Fragment>
      <path d={areas.total} className={cx({ loitering: eventType === EVENT_TYPES.loitering })} />
      <path d={areas.partialRisk} className="partially" />
      <path d={areas.unmatchedRisk} className="unmatched" />
    </Fragment>
  )
}

interface TimeScaleProps {
  baseTimeUnit: string
  start: string
  end: string
  width: number
  onLabelCLick: (time: string, unit: string) => void
  datasetDates: { start: string; end: string }
}
const TimeScale: React.FC<TimeScaleProps> = ({
  baseTimeUnit,
  start,
  end,
  width,
  onLabelCLick,
  datasetDates,
}) => {
  const scale = scaleTime()
    .domain([new Date(start), new Date(end)])
    .range([0, width])

  const layout = getUnitsPositions(
    scale,
    start,
    end,
    datasetDates.start,
    datasetDates.end,
    baseTimeUnit
  )

  return (
    <g className="timeScale">
      {layout.map((unit: any) => (
        <g key={unit.id} onClick={() => onLabelCLick('time', unit)}>
          <text x={toPercentage(unit.x + unit.width / 2, width)} y={GRAPH_HEIGHT}>
            {unit.label.toUpperCase()}
          </text>
          <line
            x1={toPercentage(unit.x, width)}
            x2={toPercentage(unit.x, width)}
            y1={0}
            y2={GRAPH_HEIGHT}
          ></line>
        </g>
      ))}
    </g>
  )
}

let prevLayoutData: any

interface ChartProps {
  data: any
  noDataMsg?: string
  type: string
  baseTimeUnit: string | null
  start: string
  end: string
  eventType: EventType
  flagType: string | null
  allRfmos?: string[]
  setFilters: (query: QueryParams) => void
  datasetDates: { start: string; end: string }
}
const Chart: React.FC<ChartProps> = (props) => {
  const {
    data,
    noDataMsg,
    type,
    baseTimeUnit,
    start,
    end,
    eventType,
    flagType,
    setFilters,
    datasetDates,
    allRfmos,
  } = props
  const [containerRef, { width = 0 }] = useElementSize({ debounce: type === 'time' ? 0 : 200 })

  const categoryLayout = useMemo(() => {
    return CategoryLayout({
      columnPadding: 15,
      unitIntervals: [2, 5, 10, 15, 20, 25, 30, 35, 40, 50],
      unitPadding: 0.5,
      minUnitSize: 5,
      maxUnitSize: 15,
      unitSort: sort.unit,
      allRfmos,
    })
  }, [allRfmos])

  const temporalLayout = useMemo(() => {
    return TemporalLayout({
      minUnitPadding: 2,
      timeIntervals: [
        [1, 'hour'],
        [1, 'day'],
        [1, 'week'],
        [1, 'month'],
      ],
      minUnitSize: 5,
      unitSort: sort.unit,
    })
  }, [])

  const layoutData = useMemo(() => {
    let prevKeys = []
    if (prevLayoutData && prevLayoutData.items) {
      // generate a list of previously displayed items ids to allow 'smart' sorting for transitions
      // Basically doing a componentDidUpdate here, meh
      prevKeys = prevLayoutData.items
        .filter((item: any) => item.data)
        .map((item: any) => item.data.id)
    }

    const newLayoutData =
      type !== 'time'
        ? categoryLayout(
            data,
            width - HORIZONTAL_PADDING * 2,
            GRAPH_HEIGHT - VERTICAL_PADDING,
            type,
            (sort as any)[type]
          )
        : temporalLayout(
            data,
            width - HORIZONTAL_PADDING * 2,
            GRAPH_HEIGHT - VERTICAL_PADDING,
            start,
            end
          )

    if (newLayoutData !== null && newLayoutData.items) {
      newLayoutData.items = transitionsSort(newLayoutData.items, prevKeys, newLayoutData.baseItem)
    }
    prevLayoutData = newLayoutData
    return newLayoutData
  }, [type, categoryLayout, data, width, temporalLayout, start, end])

  const { items, columns, areas, aggregated } = layoutData as any

  const handleColumLabelClick = useCallback(
    (type, item) => {
      if (type === 'time') {
        const offset = new Date().getTimezoneOffset()
        const addOffsetFn = offset > 0 ? addMinutes : subMinutes
        const start = new Date(addOffsetFn(new Date(item.start), offset)).toISOString()
        // Needs to add 1hour as the layout removes it, see:
        // https://github.com/GlobalFishingWatch/map-components/blob/8faab2b015339bd2a14f1781736e4a51b6a65f5a/src/timebar/layouts/index.js#L109
        // const beforeDate = new Date(item.end)
        // const beforeMs = beforeDate.setHours(beforeDate.getHours() + 1)
        // const end = new Date(addOffsetFn(new Date(beforeMs), offset)).toISOString()
        const end = subMinutes(new Date(addOffsetFn(new Date(item.end), offset)), 1).toISOString()
        setFilters({ start, end })
      } else if (type === 'rfmo') {
        setFilters({ [type]: [item.key], eez: undefined })
      } else if (type === 'eez') {
        setFilters({ [type]: [item.key], rfmo: undefined })
      } else if (type === 'flag') {
        if (flagType === 'flag-carrier') {
          setFilters({ flag: [item.key] })
        } else if (flagType === 'flag-vessel') {
          setFilters({ flagDonor: [item.key] })
        }
      } else {
        setFilters({ [type]: [item.key] })
      }
    },
    [flagType, setFilters]
  )

  const handleEventClick = useCallback(
    ({ data }) => {
      if (data && data.vessel) {
        setFilters({ vessel: data.vessel.id, timestamp: data.t })
      }
    },
    [setFilters]
  )

  if (!columns.length && !items) {
    return (
      <div
        ref={containerRef as any}
        className="events-graph-empty"
        style={{ height: TOTAL_HEIGHT }}
      >
        <p>{noDataMsg}</p>
      </div>
    )
  }

  return (
    <div ref={containerRef as any} style={{ height: TOTAL_HEIGHT }}>
      {width && (
        <svg height={TOTAL_HEIGHT} className="events-graph">
          <g transform={`translate(${HORIZONTAL_PADDING}, ${VERTICAL_PADDING})`}>
            {type !== 'time' && columns && (
              <ColumnLabels
                columns={columns}
                width={width}
                type={type}
                onLabelClick={handleColumLabelClick}
              />
            )}
            {type !== 'time' && columns && <ValueLabels columns={columns} width={width} />}
            {type !== 'time' && columns && aggregated === true && (
              <CategoryColumns columns={columns} width={width} eventType={eventType} />
            )}
            {aggregated !== true && items && (
              <Circles
                items={items}
                width={width}
                type={type}
                eventType={eventType}
                onEventClick={handleEventClick}
              />
            )}
            {aggregated === true && areas && type === 'time' && (
              <TemporalAreas areas={areas} eventType={eventType} />
            )}
            {type === 'time' && baseTimeUnit && (
              <TimeScale
                baseTimeUnit={baseTimeUnit}
                start={start}
                end={end}
                datasetDates={datasetDates}
                width={width - HORIZONTAL_PADDING * 2}
                onLabelCLick={handleColumLabelClick}
              />
            )}
          </g>
        </svg>
      )}
    </div>
  )
}

export default Chart
