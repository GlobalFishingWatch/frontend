import type { Layer } from '@deck.gl/core'
import type { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import type { PolygonPickingObject } from '@globalfishingwatch/deck-layers'
import type { BaseMapLayer } from './layers/basemap/BasemapLayer'
import type { ContextLayer } from './layers/context/ContextLayer'
import type { FourwingsLayer } from './layers/fourwings/FourwingsLayer'
import type { VesselLayer } from './layers/vessel/VesselLayer'
import type { RulersLayer } from './layers/rulers/RulersLayer'
import type { ContextPickingObject, ContextPickingInfo } from './layers/context'
import type {
  FourwingsPickingObject,
  FourwingsPickingInfo,
  FourwingsClusterPickingObject,
  FourwingsClustersLayer,
  FourwingsClusterPickingInfo,
} from './layers/fourwings'
import type { RulerPickingObject, RulerPickingInfo } from './layers/rulers'
import type { VesselEventPickingObject, VesselEventPickingInfo } from './layers/vessel'
import type { DrawLayer, DrawPickingInfo, DrawPickingObject } from './layers/draw'
import type { UserLayerPickingObject } from './layers/user'

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
