import maxBy from 'lodash/maxBy'
import {
  startOfMonth,
  startOfWeek,
  startOfDay,
  startOfHour,
  endOfMonth,
  endOfWeek,
  endOfDay,
  endOfHour,
  addMonths,
  addWeeks,
  addDays,
  addHours,
} from 'date-fns'
import { stack, stackOffsetSilhouette, area } from 'd3-shape'
import { scaleTime, scaleLinear } from 'd3-scale'
import { ENCOUNTER_RISKS } from 'data/constants'

const startOf = {
  month: startOfMonth,
  week: startOfWeek,
  day: startOfDay,
  hour: startOfHour,
}
const endOf = {
  month: endOfMonth,
  week: endOfWeek,
  day: endOfDay,
  hour: endOfHour,
}
const add = {
  month: addMonths,
  week: addWeeks,
  day: addDays,
  hour: addHours,
}

const getNumIntervals = (intervalUnit, intervalMultiple, start, end) => {
  let currentStart = start

  let numIntervals = 0
  while (currentStart.getTime() < end.getTime()) {
    currentStart = add[intervalUnit](currentStart, intervalMultiple)
    numIntervals++
  }
  return numIntervals
}

const groupByInterval = (data, intervalUnit, intervalMultiple, start, end) => {
  let currentStart = start

  const columns = []
  while (currentStart.getTime() < end.getTime()) {
    const nextStart = add[intervalUnit](currentStart, intervalMultiple)
    const currentTime = currentStart.getTime()
    const nextTime = nextStart.getTime()
    const items = data.filter((item) => {
      return item.t >= currentTime && item.t < nextTime
    })
    const total = items.length
    const partialRisk = items.filter((item) => item.risk === ENCOUNTER_RISKS.partially).length
    const unmatchedRisk = items.filter((item) => item.risk === ENCOUNTER_RISKS.unmatched).length
    columns.push({
      items,
      total,
      partialRisk,
      unmatchedRisk,
      lowRisk: total - partialRisk - unmatchedRisk,
      date: currentStart,
    })
    currentStart = nextStart
  }
  return columns
}

const TemporalLayout = (config) => {
  const { minUnitPadding, minUnitSize, timeIntervals, unitSort } = config
  const layout = (data, width, height, start, end) => {
    // iterate through human-readable unitIntervals to find the smallest interval possible
    // using the biggest column as ref point
    let unitSize
    // let unitPaddingH
    let columns

    for (let i = 0; i < timeIntervals.length; i++) {
      const [intervalMultiple, intervalUnit] = timeIntervals[i]
      const cleanStart = startOf[intervalUnit](new Date(start))
      const cleanEnd = endOf[intervalUnit](new Date(end))

      // get num intervals within clean range
      const numIntervals = getNumIntervals(intervalUnit, intervalMultiple, cleanStart, cleanEnd)
      // get cumulated space taken by units
      const totalMinUnitWidth = numIntervals * minUnitSize
      // get space left for padding, then calculate width of padding for one unit
      const totalPaddingSpace = width - totalMinUnitWidth
      const minUnitPaddingWidth = totalPaddingSpace / (minUnitPadding * (numIntervals - 1))
      if (minUnitPaddingWidth >= minUnitPadding) {
        // if padding is acceptable, try to see if it can fit vertically
        // Does it fit vertically with minUnitSize and minminUnitPadding
        // group by interval
        columns = groupByInterval(data, intervalUnit, intervalMultiple, cleanStart, cleanEnd)

        const biggestColumnNum = maxBy(columns, (c) => c.items.length).items.length

        const minBiggestColumnHeight =
          biggestColumnNum * minUnitSize + minUnitPadding * (biggestColumnNum - 1)

        // layout success (it fits!)
        if (minBiggestColumnHeight < height) {
          const maxUnitSizeH = (width - minUnitPadding * (numIntervals - 1)) / numIntervals
          const maxUnitSizeV = (height - minUnitPadding * (biggestColumnNum - 1)) / biggestColumnNum
          unitSize = Math.min(maxUnitSizeH, maxUnitSizeV)
          // unitPaddingH = (width - unitSize * numIntervals) / (numIntervals - 1)

          const scale = scaleTime()
            .domain([new Date(start), new Date(end)])
            .range([0, width])

          // eslint-disable-next-line no-loop-func
          columns = columns.map((column) => {
            column.x = scale(column.date) + unitSize / 2
            return column
          })

          break
        }
      }
    }

    if (unitSize === undefined) {
      const deltaMs = new Date(end).getTime() - new Date(start).getTime()
      const deltaDays = deltaMs / 1000 / 60 / 60 / 24
      const aggregatedInterval = deltaDays > 100 ? 'week' : 'day'
      const grouped = groupByInterval(data, aggregatedInterval, 1, new Date(start), new Date(end))
      const biggestValue = maxBy(grouped, (item) => item.total)?.total

      const x = scaleTime()
        .range([0, width])
        .domain([new Date(start), new Date(end)])
      const y = scaleLinear()
        .range([0, height])
        .domain([-biggestValue / 2, biggestValue / 2])
      const stackedUnmatchedRisk = stack().keys(['unmatchedRisk']).offset(stackOffsetSilhouette)(
        grouped
      )
      const stackedPartialRisk = stack().keys(['partialRisk']).offset(stackOffsetSilhouette)(
        grouped
      )
      const stackedTotal = stack().keys(['total']).offset(stackOffsetSilhouette)(grouped)
      const areaGenerator = area()
        .x((d, i) => x(grouped[i].date))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]))

      return {
        aggregated: true,
        columns: grouped,
        areas: {
          unmatchedRisk: areaGenerator(stackedUnmatchedRisk[0]),
          partialRisk: areaGenerator(stackedPartialRisk[0]),
          total: areaGenerator(stackedTotal[0]),
        },
      }
    }

    const r = unitSize / 2
    const baseItem = {
      unitSize,
      r,
    }
    columns = columns.map((column) => {
      column.items.sort(unitSort)
      let currentY = height / 2

      const items = column.items.map((item, j) => {
        const newItem = {
          data: { ...item },
          r,
          x: column.x,
          y: currentY,
        }
        let inc = (j + 1) * (unitSize + minUnitPadding)
        if (j % 2 === 1) inc *= -1
        currentY += inc
        return newItem
      })
      return {
        items,
      }
    })
    let items = []
    columns.forEach((column) => {
      items = column.items.concat(items)
    })
    return { items, columns, baseItem }
  }
  return layout
}

export default TemporalLayout
