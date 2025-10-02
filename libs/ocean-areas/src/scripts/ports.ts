import { prepare } from './lib/prepare'

prepare({
  type: 'port',
  path: 'ports',
  bucketFolder: 'public-ports-v1',
  skipDownload: true,
  geometryMode: 'point',
  propertiesMapping: {
    area: 'id',
    name: 'name',
    flag: 'flag',
  },
})
