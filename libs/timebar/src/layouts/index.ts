import dayjs, { Dayjs } from 'dayjs'
import { TimelineScale } from '../timelineContext'
import { getTime } from '../utils/internal-utils'

const getUnitLabel = (
  mUnit: Dayjs,
  baseUnit: 'year' | 'month' | 'week' | 'day' | 'hour',
  availableWidth: number
) => {
  /* eslint key-spacing: 0, no-multi-spaces: 0 */

  const getWeekFmt = (mUnit: Dayjs, isFirst = false) => {
    const mWeekEnd = mUnit.add(6, 'day')
    return `${mUnit.format('MMM')} ${mUnit.format('D')}-${mWeekEnd.format('D')} ${
      isFirst ? mUnit.format('YYYY') : ''
    }`
  }

  const FORMATS: {
    [key: string]: {
      isFirst: (fm: Dayjs) => boolean
      formats: (number | string | ((mUnit: Dayjs) => string))[][]
    }
  } = {
    year: { isFirst: () => false, formats: [[0, 'YYYY']] },
    month: {
      isFirst: (fm: Dayjs) => fm.month() === 0,
      formats: [
        [200, 'MMMM YYYY'],
        [100, 'MMMM', 'MMM YYYY'],
        [0, 'MMM', 'MMM YY'],
      ],
    },
    week: {
      isFirst: (fm: Dayjs) => {
        return fm.date() === 1
      },
      formats: [
        [
          0,
          (mUnit: Dayjs) => {
            return getWeekFmt(mUnit)
          },
          (mUnit: Dayjs) => {
            return getWeekFmt(mUnit, true)
          },
        ],
      ],
    },
    day: {
      isFirst: (fm: Dayjs) => fm.date() === 1,
      formats: [
        [999, 'ddd D MMMM YYYY'],
        [200, 'ddd D MMMM'],
        [70, 'ddd D', 'MMM 1'],
        [0, 'D', 'MMM'],
      ],
    },
    hour: {
      isFirst: (fm: Dayjs) => fm.hour() === 0,
      formats: [
        [999, 'ddd D MMMM YYYY H[H]'],
        [0, 'H[H]', 'ddd D'],
      ],
    },
  }
  const unitFormat = FORMATS[baseUnit]
  let format
  for (let i = 0; i < unitFormat.formats.length; i += 1) {
    const formatMinWidth = unitFormat.formats[i][0] as number
    if (availableWidth > formatMinWidth) {
      format = unitFormat.formats[i]
      break
    }
  }

  if (!format) {
    return mUnit.format()
  }
  const isFirst = unitFormat.isFirst(mUnit)
  const finalFormat = isFirst && format[2] ? format[2] : format[1]
  return typeof finalFormat === 'function'
    ? finalFormat(mUnit)
    : mUnit.format(finalFormat as string)
}

export const getUnitsPositions = (
  outerScale: TimelineScale,
  outerStart: string,
  outerEnd: string,
  absoluteStart: string,
  absoluteEnd: string,
  baseUnit: 'year' | 'month' | 'week' | 'day' | 'hour',
  labels: Record<string, any> = { zoomTo: 'Zoom to' }
) => {
  const startMs = Math.max(getTime(outerStart), getTime(absoluteStart))
  const endMs = Math.min(getTime(outerEnd), getTime(absoluteEnd))

  // BUFFER ??
  const mOuterStart = dayjs(startMs).utc().startOf(baseUnit)
  const mOuterEnd = dayjs(endMs).utc().endOf(baseUnit)

  const units = []
  const numUnitsOffset = getTime(outerEnd) > getTime(absoluteEnd) ? 0 : 1
  const numUnits = mOuterEnd.diff(mOuterStart, baseUnit) + numUnitsOffset

  let mUnit = mOuterStart
  if (mUnit.isValid()) {
    let x = outerScale(mUnit.toDate())

    for (let ui = 0; ui <= numUnits; ui += 1) {
      const mUnitNext = mUnit.add(1, baseUnit)
      const xNext = outerScale(mUnitNext.toDate())

      const id = mUnit.format(
        {
          year: 'YYYY',
          month: 'YYYY-MM',
          week: 'YYYY-MM-DD',
          day: 'YYYY-MM-DD',
          hour: 'YYYY-MM-DD-HH',
        }[baseUnit]
      )

      const width = xNext - x
      const unit = {
        id,
        x,
        width,
        label: getUnitLabel(mUnit, baseUnit, width),
        hoverLabel: `${getUnitLabel(mUnit, baseUnit, Infinity)} - ${labels.zoomTo} ${
          labels.intervals?.[baseUnit] as string
        }`,
        start: mUnit.toISOString(),
        end: mUnitNext.toISOString(),
      }
      units.push(unit)
      mUnit = mUnitNext
      x = xNext
    }
  }

  return units
}
