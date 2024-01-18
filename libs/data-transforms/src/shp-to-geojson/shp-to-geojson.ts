import {
  DatasetGeometryToGeoJSONGeometry,
  DatasetGeometryType,
} from '@globalfishingwatch/api-types'

export const shpToGeoJSON = async (data: string, type: DatasetGeometryType) => {
  const shpjs = await import('shpjs').then((module) => module.default)
  const expandedShp = await shpjs(data)
  const normalizedTypes: Partial<DatasetGeometryToGeoJSONGeometry> = {
    points: 'Point',
    tracks: 'LineString',
    polygons: 'Polygon',
  }
  if (Array.isArray(expandedShp)) {
    const matchedTypeCollections = expandedShp.filter(
      (shp) => shp.features?.[0].geometry.type === normalizedTypes[type]
    )
    if (!matchedTypeCollections.length) {
      throw new Error(`No ${type} data found in the shapefile`)
    } else if (matchedTypeCollections.length > 1) {
      throw new Error(
        'Shapefiles containing multiple components (multiple file names) are not supported yet'
      )
    } else {
      return matchedTypeCollections[0]
    }
  } else {
    if (expandedShp.features?.[0].geometry.type !== normalizedTypes[type]) {
      throw new Error(`No ${type} data found in the shapefile`)
    }
    return expandedShp
  }
}
