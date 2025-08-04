import type { Feature, LineString } from 'geojson'

import type { DeckLayerProps } from '../../types'

export type BathymetryContourLayerProps = DeckLayerProps<{
  tilesUrl: string
  filters?: Record<string, any>
  color: string
  thickness: number
}>

export type BathymetryContourFeature = Feature<LineString>
