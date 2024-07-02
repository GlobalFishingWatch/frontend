import { ExpressionSpecification, FilterSpecification } from '@globalfishingwatch/maplibre-gl'
import {
  AnyGeneratorConfig,
  GlobalUserContextGeneratorConfig,
  GlobalUserPointsGeneratorConfig,
  LayerVisibility,
} from './types'

export function isNumeric(str: string | number) {
  if (typeof str == 'number') return true
  return !isNaN(parseFloat(str))
}

export function isConfigVisible(config: AnyGeneratorConfig): LayerVisibility {
  return config.visible !== undefined && config.visible !== null
    ? config.visible
      ? 'visible'
      : 'none'
    : 'visible'
}

export const toURLArray = (paramName: string, arr: string[]) => {
  if (!arr?.length) return ''
  return arr
    .flatMap((element, i) => {
      if (!element) return []
      return `${paramName}[${i}]=${element}`
    })
    .join('&')
}

export const addURLSearchParams = (url: URL, key: string, values: any[]): URL => {
  if (!url) {
    console.warn('URL is needed in addUrlSearchParams')
    return url
  }
  if (!key || !values?.length) {
    console.warn('key and values are needed in addUrlSearchParams')
    return url
  }
  values.forEach((value, index) => {
    url.searchParams.set(`${key}[${index}]`, value)
  })
  return url
}

const getFallbackFilterExpression = (property: string, fallback: number) => {
  return [
    'case',
    ['>', ['length', ['to-string', ['get', property]]], 0],
    ['to-number', ['get', property]],
    fallback,
  ] as ExpressionSpecification
}

export const getTimeFilterForUserContextLayer = (
  config: GlobalUserContextGeneratorConfig | GlobalUserPointsGeneratorConfig
): FilterSpecification | undefined => {
  if (!config?.startTimeFilterProperty && !config?.endTimeFilterProperty) return undefined
  const startMs = new Date(config.start).getTime()
  const endMs = new Date(config.end).getTime()
  if (config?.startTimeFilterProperty && config?.endTimeFilterProperty) {
    return [
      'all',
      ['<=', getFallbackFilterExpression(config.startTimeFilterProperty, 0), endMs],
      [
        '>=',
        getFallbackFilterExpression(config.endTimeFilterProperty, Number.MAX_SAFE_INTEGER),
        startMs,
      ],
    ]
  }
  // Show for every time range after the start
  if (config?.startTimeFilterProperty) {
    return [
      'all',
      ['<=', getFallbackFilterExpression(config.startTimeFilterProperty, 0), endMs],
      ['>=', getFallbackFilterExpression(config.startTimeFilterProperty, 0), startMs],
    ]
  }
  if (config?.endTimeFilterProperty) {
    // Show for every time range before the end
    return [
      'all',
      [
        '>=',
        getFallbackFilterExpression(config.endTimeFilterProperty, Number.MAX_SAFE_INTEGER),
        startMs,
      ],
      [
        '<=',
        getFallbackFilterExpression(config.endTimeFilterProperty, Number.MAX_SAFE_INTEGER),
        endMs,
      ],
    ]
  }
  return undefined
}
