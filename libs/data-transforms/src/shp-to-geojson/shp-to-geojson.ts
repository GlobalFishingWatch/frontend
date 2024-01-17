import {
  DatasetGeometryToGeoJSONGeometry,
  DatasetGeometryType,
} from '@globalfishingwatch/api-types'

export const shpToGeoJSON = async (data: string, type: DatasetGeometryType) => {
  try {
    const shpjs = await import('shpjs').then((module) => module.default)
    const expandedShp = await shpjs(data)
    console.log('🚀 ~ shpToGeoJSON ~ expandedShp:', expandedShp)
    const normalizedTypes: DatasetGeometryToGeoJSONGeometry<DatasetGeometryType> = {
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
      } else if (matchedTypeCollections.length === 1) {
        return matchedTypeCollections[0]
      } else {
        throw new Error(
          'Shapefiles containing multiple components (multiple file names) are not supported yet'
        )
      }
    } else {
      if (expandedShp.features?.[0].geometry.type !== normalizedTypes[type]) {
        throw new Error(`No ${type} data found in the shapefile`)
      }
      // if (
      //   expandedShp.extensions &&
      //   (!expandedShp.extensions.includes('.shp') ||
      //     !expandedShp.extensions.includes('.shx') ||
      //     !expandedShp.extensions.includes('.prj') ||
      //     !expandedShp.extensions.includes('.dbf'))
      // ) {
      //   return t(
      //     'errors.uploadShapefileComponents',
      //     'Error reading shapefile: must contain files with *.shp, *.shx, *.dbf and *.prj extensions.'
      //   )
      // } else {
      // }
      return expandedShp
    }
  } catch (e: any) {
    console.log('Error loading shapefile file', e)
    throw new Error(e)
  }
}
