import { DataFilterExtension } from '@deck.gl/extensions'
import {
  BaseUserLayerProps,
  UserContextFeature,
  UserContextLayerProps,
  UserPointsLayerProps,
} from './user.types'

export function getTilesUrl(tilesUrl: string, props: UserContextLayerProps | UserPointsLayerProps) {
  const { filter, valueProperties, startTimeProperty, endTimeProperty } = props
  const stepsPickValue = (props as UserContextLayerProps)?.stepsPickValue
  const circleRadiusProperty = (props as UserPointsLayerProps)?.circleRadiusProperty
  const tilesUrlObject = new URL(tilesUrl)
  if (filter) {
    tilesUrlObject.searchParams.set('filter', filter)
  }
  // Needed for invalidate caches on user changes
  const properties = [
    ...(valueProperties || []),
    startTimeProperty || '',
    endTimeProperty || '',
    stepsPickValue || '',
    circleRadiusProperty || '',
  ].filter((p) => !!p)
  if (properties.length) {
    properties.forEach((property, index) => {
      tilesUrlObject.searchParams.set(`properties[${index}]`, property)
    })
  }
  // Decode the url is needed to keep the {x|y|z} format in the coordinates tiles
  return decodeURI(tilesUrlObject.toString())
}

// update this in Sat Nov 20 2286 as deck gl does not support Infinity
const INFINITY_TIMERANGE_LIMIT = 9999999999999

export function getTimeFilterProps(props: BaseUserLayerProps) {
  const { startTime, endTime, startTimeProperty, endTimeProperty, timeFilterType } = props
  if (!timeFilterType || (!startTime && !endTime && !startTimeProperty && !endTimeProperty))
    return {}
  if (timeFilterType === 'date') {
    if (startTimeProperty) {
      return {
        getFilterValue: (d: UserContextFeature) => d.properties[startTimeProperty as string],
        filterRange: [startTime, endTime],
        extensions: [new DataFilterExtension({ filterSize: 1 })],
      }
    }
  } else if (timeFilterType === 'dateRange') {
    if (startTimeProperty && endTimeProperty) {
      return {
        getFilterValue: (d: UserContextFeature) => [
          d.properties[startTimeProperty as string],
          d.properties[endTimeProperty as string],
        ],
        filterRange: [
          [0, endTime],
          [startTime, INFINITY_TIMERANGE_LIMIT],
        ],
        extensions: [new DataFilterExtension({ filterSize: 2 })],
      }
    } else if (endTimeProperty) {
      return {
        getFilterValue: (d: UserContextFeature) => d.properties[endTimeProperty as string],
        filterRange: [startTime, INFINITY_TIMERANGE_LIMIT],
        extensions: [new DataFilterExtension({ filterSize: 1 })],
      }
    } else if (startTimeProperty) {
      return {
        getFilterValue: (d: UserContextFeature) => d.properties[startTimeProperty as string],
        filterRange: [0, endTime],
        extensions: [new DataFilterExtension({ filterSize: 1 })],
      }
    }
  }
  return {}
}
