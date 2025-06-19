import type { Feature, FeatureCollection, Geometry, Point } from 'geojson'

import type { OceanAreaProperties } from '../ocean-areas'

import portsData from './source/ports.json'

const ports: FeatureCollection<Geometry, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: portsData as Feature<Point, OceanAreaProperties>[],
}

export default ports
