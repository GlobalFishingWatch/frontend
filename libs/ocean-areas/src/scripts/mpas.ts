import type { Feature } from 'geojson'

import { prepare } from './lib/prepare'

prepare({
  type: 'mpa',
  path: 'mpas',
  bucketFolder: 'public-mpa-all',
  skipDownload: true,
  geometryMode: 'bbox',
  propertiesMapping: {
    area: 'WDPA_PID',
    name: 'NAME',
  },
  limitBy: (areas: Feature[]) => {
    const areasByArea = areas.sort((a, b) => a.properties?.GIS_AREA - b.properties?.GIS_AREA)
    return areasByArea
  },
})
