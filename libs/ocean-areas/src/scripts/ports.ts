import type { Feature } from 'geojson'

import { prepare } from './lib/prepare'

prepare({
  type: 'ports',
  path: 'ports',
  bucketFolder: 'public-ports-v1',
  skipDownload: false,
  geometryMode: 'bbox',
  propertiesMapping: {
    area: 'id',
    name: 'name',
  },
})
