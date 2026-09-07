import { prepare } from './lib/prepare.ts'

prepare({
  type: 'port',
  path: 'ports-v5',
  fileName: 'ports',
  bucketFolder: 'public-global-ports:v5',
  skipDownload: true,
  geometryMode: 'point',
  propertiesMapping: {
    area: 'port_id',
    name: 'name',
    flag: 'flag',
  },
  filter: (port) => {
    const { name, flag } = port.properties ?? {}
    // Names starting with their own flag code are placeholders (`CHL-1234`), not real ports
    if (!name || !flag || name.startsWith(flag)) {
      return false
    }
    return true
    // return getPortSources(port).length > 0
  },
})
