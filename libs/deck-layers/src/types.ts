import type { Layer } from '@deck.gl/core'

import type { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import type { PolygonPickingObject } from '@globalfishingwatch/deck-layers'

import type { BaseMapLayer } from './layers/basemap/BasemapLayer'
import type { ContextPickingInfo,ContextPickingObject } from './layers/context'
import type { ContextLayer } from './layers/context/ContextLayer'
import type { DrawLayer, DrawPickingInfo, DrawPickingObject } from './layers/draw'
import type {
  FourwingsClusterPickingInfo,
  FourwingsClusterPickingObject,
  FourwingsClustersLayer,
  FourwingsPickingInfo,
  FourwingsPickingObject,
} from './layers/fourwings'
import type { FourwingsLayer } from './layers/fourwings/FourwingsLayer'
import type { RulerPickingInfo,RulerPickingObject } from './layers/rulers'
import type { RulersLayer } from './layers/rulers/RulersLayer'
import type { UserLayerPickingObject } from './layers/user'
import type { VesselEventPickingInfo,VesselEventPickingObject } from './layers/vessel'
import type { VesselLayer } from './layers/vessel/VesselLayer'

export type DeckLayerCategory = `${DataviewCategory}` | 'rulers' | 'draw'
export type DeckLayerSubcategory = `${DataviewType}` | 'draw-polygons' | 'draw-points'

export type DeckLayerProps<G> = {
  id: string
  category: DeckLayerCategory
  subcategory?: DeckLayerSubcategory
} & G

export type DeckPickingObject<G> = {
  id: string
  title?: string
  layerId: string
  color?: string
  category: DeckLayerCategory
  subcategory?: DeckLayerSubcategory
  uniqueFeatureInteraction?: boolean
} & G

export type AnyDeckLayer<D extends object = object> =
  | Layer<D>
  | BaseMapLayer
  | ContextLayer
  | FourwingsLayer
  | VesselLayer
  | RulersLayer

export type LayerWithIndependentSublayersLoadState = VesselLayer

export type DeckLayerPickingObject =
  | FourwingsPickingObject
  | ContextPickingObject
  | UserLayerPickingObject
  | FourwingsClusterPickingObject
  | RulerPickingObject
  | VesselEventPickingObject
  | DrawPickingObject
  | PolygonPickingObject

export type DeckLayerInteractionPickingInfo =
  | (FourwingsPickingInfo & { layer: FourwingsLayer })
  | (ContextPickingInfo & { layer: ContextLayer })
  | (FourwingsClusterPickingInfo & { layer: FourwingsClustersLayer })
  | (RulerPickingInfo & { layer: RulersLayer })
  | (VesselEventPickingInfo & { layer: VesselLayer })
  | (DrawPickingInfo & { layer: DrawLayer })
