import type {
  DatasetGeometryToGeoJSONGeometry,
  DatasetGeometryType,
} from '@globalfishingwatch/api-types'

const invalidDataErrorHandler = (type: DatasetGeometryType) => {
  switch (type) {
    case 'tracks':
      throw new Error('datasetUpload.errors.shapefile.noLineData')
    case 'points':
      throw new Error('datasetUpload.errors.shapefile.noPointData')
    case 'polygons':
      throw new Error('datasetUpload.errors.shapefile.noPolygonData')
    default:
      throw new Error('datasetUpload.errors.shapefile.invalidData')
  }
}

export const shpToGeoJSON = async (data: string, type: DatasetGeometryType) => {
  const shpjs = await import('shpjs').then((module) => module.default)
  const expandedShp = await shpjs(data)
  const normalizedTypes: Partial<DatasetGeometryToGeoJSONGeometry> = {
    points: ['Point', 'MultiPoint'],
    tracks: ['LineString', 'MultiLineString'],
    polygons: ['Polygon', 'MultiPolygon'],
  }
  if (Array.isArray(expandedShp)) {
    const matchedTypeCollections = expandedShp.filter((shp) =>
      normalizedTypes[type]?.includes(shp.features?.[0].geometry.type)
    )
    if (!matchedTypeCollections.length) {
      return invalidDataErrorHandler(type)
    } else if (matchedTypeCollections.length > 1) {
      throw new Error('datasetUpload.errors.shapefile.invalidMultipleFiles')
    } else {
      return matchedTypeCollections[0]
    }
  } else {
    if (!normalizedTypes[type]?.includes(expandedShp.features?.[0].geometry.type)) {
      invalidDataErrorHandler(type)
    }
    return expandedShp
  }
}
