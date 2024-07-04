import { DataviewType } from '@globalfishingwatch/api-types'
import { DeckLayerPickingObject } from '@globalfishingwatch/deck-layers'

export const isTilesClusterLayer = (pickingObject: DeckLayerPickingObject) =>
  pickingObject.subcategory === DataviewType.TileCluster

export const isRulerLayerPoint = (pickingObject: DeckLayerPickingObject) =>
  pickingObject.category === 'rulers'
