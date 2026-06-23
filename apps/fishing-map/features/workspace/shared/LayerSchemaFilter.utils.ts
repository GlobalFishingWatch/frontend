import type { DataviewFilterConfig } from 'features/dataviews/dataviews.filters'
import { t } from 'features/i18n/i18n'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'

export const showSchemaFilter = (schemaFilter: DataviewFilterConfig) => {
  return !schemaFilter.disabled && schemaFilter.options && schemaFilter.options.length > 0
}

type TransformationUnit = 'minutes' | 'hours' | 'km'

type Transformation = {
  in?: (v: any) => number
  out?: (v: any) => number
  getLabel: () => string
}

const VALUE_TRANSFORMATIONS_BY_UNIT: Record<TransformationUnit, Transformation> = {
  minutes: {
    in: (v) => parseFloat(v) / 60,
    out: (v) => parseFloat(v) * 60,
    getLabel: () => t((t) => t.common.hours),
  },
  hours: {
    in: (v) => parseInt(v),
    out: (v) => parseInt(v),
    getLabel: () => t((t) => t.common.hours),
  },
  km: {
    getLabel: () => t((t) => t.common.km),
  },
}

const getValueByUnit = (
  value: string | number,
  { unit, transformDirection = 'in' } = {} as { unit?: string; transformDirection?: 'in' | 'out' }
): number => {
  const transformConfig = VALUE_TRANSFORMATIONS_BY_UNIT[unit as TransformationUnit]
  if (transformConfig?.[transformDirection]) {
    return transformConfig[transformDirection](value)
  }
  if (typeof value === 'number') return value
  return parseFloat(value)
}

const getUnitLabel = (unit?: string): string => {
  if (!unit) return ''
  const label = VALUE_TRANSFORMATIONS_BY_UNIT[unit as TransformationUnit]?.getLabel?.()
  return label || unit || ''
}

export const getValueLabelByUnit = (
  value: string | number,
  { unit, unitLabel = true } = {} as { unit?: string; unitLabel?: boolean }
): string => {
  if (unitLabel) {
    return `${formatI18nNumber(getValueByUnit(value, { unit }))} ${getUnitLabel(unit)}`
  }
  return formatI18nNumber(getValueByUnit(value, { unit })) as string
}

export const getLabelWithUnit = (label: string, unit?: string): string => {
  const translation = t(
    (t: any) => {
      return t[label]
    },
    { defaultValue: label, returnObjects: true } as any
  )
  const translatedLabel = typeof translation === 'string' ? translation : label
  if (unit) {
    return `${translatedLabel} (${getUnitLabel(unit)})`
  }
  return translatedLabel
}

export const getSchemaValueRounded = (value: number, decimals = 2): number => {
  return parseFloat(value.toFixed(decimals))
}
