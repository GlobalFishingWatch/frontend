import type { Feature } from 'geojson'

import { prepare } from './lib/prepare'

prepare({
  type: 'port',
  path: 'ports',
  bucketFolder: 'public-ports-v1',
  skipDownload: true,
  geometryMode: 'bbox',
  propertiesMapping: {
    area: 'id',
    name: 'name',
  },
})
