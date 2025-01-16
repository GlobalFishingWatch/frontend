import { kml } from '@tmcw/togeojson'
import { featureCollection } from '@turf/helpers'
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'

import type { DatasetGeometryType } from '@globalfishingwatch/api-types'

import type { JSZipObject } from './zip-to-files';
import { zipToFiles } from './zip-to-files'

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
        hasFeaturesOfDesiredType =
          kmlDoc.getElementsByTagName('Polygon').length > 0 ||
          kmlDoc.getElementsByTagName('MultiPolygon').length > 0
      } else if (type === 'tracks') {
        hasFeaturesOfDesiredType =
          kmlDoc.getElementsByTagName('LineString').length > 0 ||
          kmlDoc.getElementsByTagName('MultiLineString').length > 0
      } else if (type === 'points') {
        hasFeaturesOfDesiredType =
          kmlDoc.getElementsByTagName('Point').length > 0 ||
          kmlDoc.getElementsByTagName('MultiPoint').length > 0
      }

      if (hasFeaturesOfDesiredType) {
        const { features } = kml(kmlDoc)
        results.push(...(features as Feature<Geometry, GeoJsonProperties>[]))
      } else {
        invalidDataErrorHandler(type)
      }
    } catch (e: any) {
      throw new Error('datasetUpload.errors.kml.invalidData')
    }
  }

  return featureCollection(results) as FeatureCollection
}

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
