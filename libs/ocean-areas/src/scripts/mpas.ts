import type { Feature } from 'geojson'

import { prepare } from './lib/prepare.ts'

prepare({
  type: 'mpa',
  path: 'mpas',
  bucketFolder: 'public-mpa-all',
  skipDownload: true,
  geometryMode: 'bbox',
  propertiesMapping: {
    area: 'SITE_PID', // WDPA_PID in the WDPA source before 2026
    name: 'NAME',
  },
  // WDPA's marine area (km²): the meaningful size for an MPA, which often also covers land
  getAreaSize: (feature) => {
    const km2 = feature.properties?.GIS_M_AREA
    return typeof km2 === 'number' ? km2 * 1_000_000 : undefined
  },
  limitBy: (areas: Feature[]) => {
    const areasByArea = areas.sort((a, b) => a.properties?.GIS_AREA - b.properties?.GIS_AREA)
    return areasByArea
  },
})
