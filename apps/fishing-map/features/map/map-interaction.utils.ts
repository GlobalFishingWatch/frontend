import { DataviewType } from '@globalfishingwatch/api-types'
import { DeckLayerPickingObject, DrawPickingObject } from '@globalfishingwatch/deck-layers'

export const isTilesClusterLayer = (pickingObject: DeckLayerPickingObject) =>
  pickingObject.subcategory === DataviewType.TileCluster

export const isRulerLayerPoint = (pickingObject: DeckLayerPickingObject) =>
  pickingObject.category === 'rulers'

export const isDrawFeature = (feature: DeckLayerPickingObject) =>
  feature.category === 'draw' && (feature as DrawPickingObject).geometry?.type === 'Polygon'
