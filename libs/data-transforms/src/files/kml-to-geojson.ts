import { kml } from '@tmcw/togeojson'
import { featureCollection } from '@turf/turf'
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'

import type { DatasetGeometryType } from '@globalfishingwatch/api-types'

import { getUTCDateTime } from '../dates'
import { COORDINATE_PROPERTY_TIMESTAMP } from '../segments/segments.config'

import type { JSZipObject } from './zip-to-files'
import { zipToFiles } from './zip-to-files'

const invalidDataErrorHandler = (type: DatasetGeometryType) => {
  switch (type) {
    case 'tracks':
      throw new Error('datasetUpload.errors.kml.noLineData')
    case 'points':
      throw new Error('datasetUpload.errors.kml.noPointData')
    case 'polygons':
      throw new Error('datasetUpload.errors.kml.noPolygonData')
    default:
      throw new Error('datasetUpload.errors.kml.invalidData')
  }
}

const hasAnyTag = (kmlDoc: Document, tags: string[]) =>
  tags.some((tag) => kmlDoc.getElementsByTagName(tag).length > 0)

const toMillis = (time: string | number | null) => {
  if (time === null || time === undefined || time === '') return null
  const dateTime = getUTCDateTime(time)
  return dateTime.isValid ? dateTime.toMillis() : null
}

const parseCoordinateTimes = (properties: GeoJsonProperties): GeoJsonProperties => {
  const times = properties?.coordinateProperties?.[COORDINATE_PROPERTY_TIMESTAMP]
  if (!Array.isArray(times)) {
    return properties
  }
  return {
    ...properties,
    coordinateProperties: {
      ...properties!.coordinateProperties,
      [COORDINATE_PROPERTY_TIMESTAMP]: times.map((time) =>
        Array.isArray(time) ? time.map(toMillis) : toMillis(time)
      ),
    },
  }
}

export async function kmlToGeoJSON(file: File, type: DatasetGeometryType) {
  const isKMZ = file.name.endsWith('.kmz')
  const results = [] as Feature<Geometry, GeoJsonProperties>[]
  let files: JSZipObject[] | File[] = [file]

  if (isKMZ) {
    files = (await zipToFiles(file, /\.kml$/)) as JSZipObject[]
  }

  for (const file of files) {
    try {
      const str = isKMZ ? await (file as JSZipObject).async('string') : await (file as File).text()
      const kmlDoc = new DOMParser().parseFromString(str, 'text/xml')
      let hasFeaturesOfDesiredType: boolean = false
      if (type === 'polygons') {
        hasFeaturesOfDesiredType = hasAnyTag(kmlDoc, [
          'Polygon',
          'MultiPolygon',
          'LineString',
          'MultiLineString',
        ])
      } else if (type === 'tracks') {
        hasFeaturesOfDesiredType = hasAnyTag(kmlDoc, [
          'LineString',
          'MultiLineString',
          'gx:Track',
          'Track',
          'gx:MultiTrack',
          'MultiTrack',
        ])
      } else if (type === 'points') {
        hasFeaturesOfDesiredType = hasAnyTag(kmlDoc, ['Point', 'MultiPoint'])
      }

      if (hasFeaturesOfDesiredType) {
        const { features } = kml(kmlDoc)
        results.push(
          ...(features.map((feature, index) => ({
            ...feature,
            properties: parseCoordinateTimes({ ...(feature.properties || {}), gfw_id: index + 1 }),
          })) as Feature<Geometry, GeoJsonProperties>[])
        )
      } else {
        invalidDataErrorHandler(type)
      }
    } catch (e: any) {
      throw new Error('datasetUpload.errors.kml.invalidData', { cause: e })
    }
  }

  return featureCollection(results) as FeatureCollection
}
