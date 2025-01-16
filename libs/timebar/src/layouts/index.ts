import { DateTime } from 'luxon'

import type { TimelineScale } from '../timelineContext'
import { getTime } from '../utils/internal-utils'

const getUnitLabel = (
  mUnit: DateTime,
  baseUnit: 'year' | 'month' | 'week' | 'day' | 'hour',
  availableWidth: number,
  locale: string
) => {
  /* eslint key-spacing: 0, no-multi-spaces: 0 */

  // TODO: localise

  const getWeekFmt = (mUnit: DateTime, isFirst = false) => {
    const mWeekEnd = mUnit.plus({ days: 6 })
    return `${mUnit.toFormat('MMM')} ${mUnit.toFormat('d')}-${mWeekEnd.toFormat('d')} ${
      isFirst ? mUnit.toFormat('yyyy') : ''
    }`
  }

  const FORMATS: {
    [key: string]: {
      isFirst: (fm: DateTime) => boolean
      formats: (number | string | ((mUnit: DateTime) => string))[][]
    }
  } = {
    year: { isFirst: () => false, formats: [[0, 'yyyy']] },
    month: {
      isFirst: (fm: DateTime) => fm.month === 1,
      formats: [
        [200, 'MMMM yyyy'],
        [100, 'MMMM', 'MMM yyyy'],
        [0, 'MMM', 'MMM yy'],
      ],
    },
    week: {
      isFirst: (fm: DateTime) => {
        return fm.day === 1
      },
      formats: [
        [
          0,
          (mUnit: DateTime) => {
            return getWeekFmt(mUnit)
          },
          (mUnit: DateTime) => {
            return getWeekFmt(mUnit, true)
          },
        ],
      ],
    },
    day: {
      isFirst: (fm: DateTime) => fm.day === 1,
      formats: [
        [999, 'EEE d MMMM yyyy'],
        [200, 'EEE d MMMM'],
        [70, 'EEE d', 'MMM 1'],
        [0, 'd', 'MMM'],
      ],
    },
    hour: {
      isFirst: (fm: DateTime) => fm.hour === 0,
      formats: [
        [999, 'EEE d MMMM yyyy H'],
        [0, 'H', 'd MMM'],
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
    return mUnit.toISO()
  }
  const isFirst = unitFormat.isFirst(mUnit)
  const finalFormat = isFirst && format[2] ? format[2] : format[1]
  return typeof finalFormat === 'function'
    ? finalFormat(mUnit)
    : mUnit.setLocale(locale).toFormat(finalFormat as string)
}

export const getUnitsPositions = (
  outerScale: TimelineScale,
  outerStart: string,
  outerEnd: string,
  absoluteStart: string,
  absoluteEnd: string,
  baseUnit: 'year' | 'month' | 'week' | 'day' | 'hour',
  labels: Record<string, any> = { zoomTo: 'Zoom to' },
  locale: string
) => {
  const startMs = Math.max(getTime(outerStart), getTime(absoluteStart))
  const endMs = Math.min(getTime(outerEnd), getTime(absoluteEnd))

  // BUFFER ??
  const mOuterStart = DateTime.fromMillis(startMs, { zone: 'utc' }).startOf(baseUnit)
  const mOuterEnd = DateTime.fromMillis(endMs, { zone: 'utc' }).endOf(baseUnit)

  const units = []
  const numUnitsOffset = getTime(outerEnd) > getTime(absoluteEnd) ? 0 : 1
  const durationUnit = `${baseUnit}s` as 'years' | 'months' | 'weeks' | 'days' | 'hours'
  const numUnits = mOuterEnd.diff(mOuterStart, durationUnit)?.[durationUnit] + numUnitsOffset

  let mUnit = mOuterStart
  if (mUnit.isValid) {
    let x = outerScale(mUnit.toJSDate())

    for (let ui = 0; ui <= numUnits; ui += 1) {
      const mUnitNext: DateTime = mUnit.plus({ [durationUnit]: 1 })

      const xNext = outerScale(mUnitNext.toJSDate())

      const id = mUnit.toISO()

      const width = xNext - x
      const unit = {
        id,
        x,
        width,
        label: getUnitLabel(mUnit, baseUnit, width, locale),
        hoverLabel: `${getUnitLabel(mUnit, baseUnit, Infinity, locale)} - ${labels.zoomTo} ${
          labels.intervals?.[baseUnit] as string
        }`,
        start: mUnit.toISO(),
        end: mUnitNext.toISO(),
      }
      units.push(unit)
      mUnit = mUnitNext
      x = xNext
    }
  }

  return units
}
