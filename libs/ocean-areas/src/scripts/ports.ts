import { prepare } from './lib/prepare.ts'

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
  filter: (port) =>
    port.properties ? !port.properties.name.startsWith(port.properties.flag) : false,
})
