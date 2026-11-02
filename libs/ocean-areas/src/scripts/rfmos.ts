// Source path, not the package: node cannot load the deck-layers dist (extensionless imports).
// context.config.ts has no imports, so ts-node runs it as-is.
import { HIDDEN_RFMO_IDS } from '../../../deck-layers/src/layers/context/context.config.ts'

import { prepare } from './lib/prepare.ts'

prepare({
  type: 'rfmo',
  path: 'rfmos',
  bucketFolder: 'public-rfmo',
  skipDownload: true,
  geometryMode: 'bbox',
  propertiesMapping: {
    area: 'ID',
    name: 'ID',
  },
  // Same RFMOs hidden on the map, mostly global bodies whose bbox (and report) is the whole ocean
  filter: (feature) => !HIDDEN_RFMO_IDS.includes(feature.properties?.ID),
})
