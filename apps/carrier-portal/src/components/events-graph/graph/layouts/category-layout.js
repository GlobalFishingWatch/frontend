import groupBy from 'lodash/groupBy'
import maxBy from 'lodash/maxBy'
import { ENCOUNTER_RISKS } from 'data/constants'

const CategoryLayout = (config) => {
  const {
    minTotalWidth,
    defaultColumnPadding,
    columnPadding,
    unitIntervals,
    unitPadding,
    minUnitSize,
    maxUnitSize,
    unitSort,
    allRfmos = [],
  } = config
  const layout = (data, width, height, filterBy, sort) => {
    // maybe this should be done outside
    let columns = groupBy(data, `${filterBy}.id`)
    // fixes when data doesn't have the filtery by property
    delete columns.null
    delete columns.undefined
    // hack to show always all rfmos
    if (filterBy === 'rfmo' && Object.keys(columns).length !== 0) {
      allRfmos.forEach((key) => {
        if (!columns[key]) {
          columns[key] = []
        }
      })
    }
    const numColumns = Object.keys(columns).length

    // turn columns dict to array
    columns = Object.keys(columns).map((columnKey) => {
      const columnValues = columns[columnKey]
      const label = columnValues.length ? columnValues[0][filterBy]?.label : columnKey
      const tooltip = columnValues.length ? columnValues[0][filterBy]?.tooltip : label
      const column = {
        label,
        tooltip,
        key: columnKey,
        count: columnValues.length || '',
        items: columns[columnKey],
      }
      return column
    })

    let colWidth
    if (columnPadding !== undefined) {
      // dynamic column width
      colWidth = (width - (numColumns - 1) * columnPadding) / numColumns
    } else {
      // colWidth is only a function of "ideal" width and padding
      colWidth = (minTotalWidth - (numColumns - 1) * defaultColumnPadding) / numColumns
    }

    // sort using provided sort function
    columns.sort(sort)

    // find biggest column
    const biggestColumnNum = columns.length ? maxBy(columns, (column) => column.count).count : 0

    const computedColumnPadding =
      columnPadding === undefined
        ? (width - colWidth * numColumns) / (numColumns - 1)
        : columnPadding

    columns = columns.map((column, columnIndex) => {
      const columnX = columnIndex * (colWidth + computedColumnPadding)
      const heightRatio = height / biggestColumnNum
      const columnHeight = column.count * heightRatio
      const computedColumn = {
        ...column,
        x: columnX,
        y: height - columnHeight,
        width: colWidth,
        height: columnHeight,
      }
      return computedColumn
    })

    // iterate through human-readable unitIntervals to find the smallest interval possible
    // using the biggest column as ref point
    let unitInterval
    let unitSize
    for (let i = 0; i < unitIntervals.length; i++) {
      const interval = unitIntervals[i]
      const unitSizeForInterval = (colWidth - (interval - 1) * unitPadding) / interval
      if (unitSizeForInterval < minUnitSize) continue
      const maxNumUnitsV = Math.ceil(biggestColumnNum / interval)
      const maxBarHeight = unitSizeForInterval * maxNumUnitsV + unitPadding * maxNumUnitsV
      if (maxBarHeight < height) {
        unitInterval = interval
        unitSize = unitSizeForInterval
        break
      }
    }

    if (unitInterval === undefined) {
      columns = columns.map((column) => {
        const unmatchedRiskRatio =
          column.items.filter((i) => i.risk === ENCOUNTER_RISKS.unmatched).length /
          column.items.length
        const partialRiskRatio =
          column.items.filter((i) => i.risk === ENCOUNTER_RISKS.partially).length /
          column.items.length
        const unmatchedRiskHeight = column.height * unmatchedRiskRatio
        const unmatchedRiskArea = {
          ...column,
          risk: ENCOUNTER_RISKS.unmatched,
          height: unmatchedRiskHeight,
          y0: height - unmatchedRiskHeight,
          y1: height,
        }
        const partialRiskHeight = column.height * partialRiskRatio
        const partialRiskArea = {
          ...column,
          risk: ENCOUNTER_RISKS.partially,
          height: partialRiskHeight,
          y0: height - unmatchedRiskHeight - partialRiskHeight,
          y1: height,
        }
        const lowRiskRatio = 1 - unmatchedRiskRatio - partialRiskRatio
        const lowRiskArea = {
          ...column,
          risk: ENCOUNTER_RISKS.authorized,
          height: column.height * lowRiskRatio,
          y0: height - column.height,
          y1: unmatchedRiskArea.y0 + partialRiskArea.y0,
        }
        return {
          ...column,
          areas: [unmatchedRiskArea, partialRiskArea, lowRiskArea],
        }
      })
      return { columns, aggregated: true }
    }
    const unitSizeWithPadding = unitSize + unitPadding
    // const r = Math.min(unitSize / 2, maxUnitSize)
    const r = Math.min(unitSize / 2, maxUnitSize)
    const baseItem = {
      unitSize,
      r,
    }
    columns = columns.map((column) => {
      columns.items = column.items.sort(unitSort)
      column.y =
        height - unitPadding - Math.ceil(column.items.length / unitInterval) * unitSizeWithPadding
      column.items = column.items.map((item, itemIndex) => {
        const unitH = itemIndex % unitInterval
        const unitV = Math.floor(itemIndex / unitInterval)
        const offset = unitSize / 2 > maxUnitSize ? unitSize / 2 - maxUnitSize : 0
        return {
          data: { ...item },
          ...baseItem,
          r,
          x: column.x + (unitH * unitSizeWithPadding + r) + offset,
          y: height - (unitV * unitSizeWithPadding + r),
        }
      })
      return column
    })

    let items = []
    columns.forEach((column) => {
      items = column.items.concat(items)
    })

    return { columns, items, baseItem }
  }
  return layout
}
export default CategoryLayout
