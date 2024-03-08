import type { Layer } from '@deck.gl/core'
import type { BaseMapLayer } from './layers/basemap/BasemapLayer'
import type { ContextLayer } from './layers/context/ContextLayer'
import type { FourwingsLayer } from './layers/fourwings/FourwingsLayer'
import type { VesselLayer } from './layers/vessel/VesselLayer'

export type AnyDeckLayer<D = unknown> =
  | Layer<D>
  | BaseMapLayer
  | ContextLayer
  | FourwingsLayer
  | VesselLayer
