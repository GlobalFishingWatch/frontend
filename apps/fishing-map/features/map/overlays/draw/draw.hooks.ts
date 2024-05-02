import { useCallback, useEffect, useMemo, useState } from 'react'
import { FeatureCollection, GeoJSON, GeoJsonProperties, Geometry, Polygon } from 'geojson'
import { atom, useAtom } from 'jotai'
import {
  CompositeMode,
  DrawPolygonMode,
  GeoJsonEditMode,
  ModifyMode,
  ViewMode,
} from '@deck.gl-community/editable-layers'
import kinks from '@turf/kinks'
import {
  DeckLayerPickingObject,
  DrawLayer,
  DrawPickingObject,
} from '@globalfishingwatch/deck-layers'
import { useDeckMap } from 'features/map/map-context.hooks'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
const INITIAL_FEATURE_COLLECTION: FeatureCollection<Geometry, GeoJsonProperties> = {
  type: 'FeatureCollection',
  features: [],
}
const INITIAL_DRAW_MODE = 'draw'
type DrawLayerMode = DrawPolygonMode | ViewMode | 'draw'
const drawFeaturesAtom = atom(INITIAL_FEATURE_COLLECTION)
export const drawMode = new DrawPolygonMode()
const selectMode = () => ViewMode
const editModeInstance = new CompositeMode([new GeoJsonEditMode(), new ModifyMode()])
// const editModeInstance = new GeoJsonEditMode()
const updatedPointAtom = atom<{ coordinates: [number, number]; index: number } | null>(null)
const drawFeaturesIndexesAtom = atom<number[]>([0])
const drawLayerModeAtom = atom<DrawLayerMode>(INITIAL_DRAW_MODE)
const layerInstanceAtom = atom<DrawLayer | null>(null)
const hasOverlappingFeaturesAtom = atom<boolean>(false)

export const useDrawLayer = () => {
  const map = useDeckMap()
  const { isMapDrawing } = useMapDrawConnect()
  map && map.setProps({ controller: { doubleClickZoom: false } })
  const [drawFeatures, setDrawFeatures] = useAtom(drawFeaturesAtom)
  const [layerInstance, setLayerInstance] = useAtom(layerInstanceAtom)
  const [drawFeaturesIndexes, setDrawFeaturesIndexes] = useAtom(drawFeaturesIndexesAtom)
  const [drawLayerMode, setDrawLayerMode] = useAtom(drawLayerModeAtom)
  const [updatedPoint, setUpdatedPoint] = useAtom(updatedPointAtom)
  const [hasOverlappingFeatures, setHasOverlappingFeatures] = useAtom(hasOverlappingFeaturesAtom)

  const resetDrawFeatures = useCallback(() => {
    setDrawFeatures(INITIAL_FEATURE_COLLECTION)
    setDrawLayerMode(INITIAL_DRAW_MODE)
  }, [setDrawFeatures, setDrawLayerMode])

  const onDrawEdit = useCallback(
    // TODO:deck fix types here
    ({ updatedData, editType, featureIndexes, editContext }: any) => {
      if (editType === 'addFeature' || editType === 'addPosition') {
        setDrawLayerMode(new ViewMode())
        setDrawFeatures(updatedData)
        setDrawFeaturesIndexes([])
      }
      if (editType === 'movePosition') {
        setDrawFeatures(updatedData)
      }
      if (editType === 'updateTentativeFeature') {
        setHasOverlappingFeatures(kinks(editContext.feature.geometry).features.length > 0)
      }
    },
    [setDrawFeatures, setDrawFeaturesIndexes, setDrawLayerMode, setHasOverlappingFeatures]
  )

  const isDrawFeature = (feature: DeckLayerPickingObject) => {
    return (
      feature.category === 'draw' && (feature as DrawPickingObject).geometry?.type === 'Polygon'
    )
  }

  const isDrawHandle = (feature: DeckLayerPickingObject) => {
    return feature.category === 'draw' && (feature as DrawPickingObject).geometry?.type === 'Point'
  }

  const getDrawCursor = ({
    features,
    isDragging,
  }: {
    features: DeckLayerPickingObject[] | undefined
    isDragging: boolean
  }) => {
    if (drawLayerMode instanceof ViewMode) {
      if (features?.some(isDrawFeature)) {
        return 'pointer'
      }
    }
    if (drawLayerMode instanceof ModifyMode) {
      if (features?.some(isDrawHandle)) {
        return 'move'
      }
    }
    if (drawLayerMode === 'draw') {
      return 'crosshair'
    }
    return isDragging ? 'grabbing' : 'grab'
  }

  const isDrawSelectMode = useCallback(() => {
    return drawLayerMode instanceof ViewMode
  }, [drawLayerMode])

  const onDrawClick = useCallback(
    (features: DeckLayerPickingObject[] | undefined) => {
      const drawFeature = features?.find(isDrawFeature) as DrawPickingObject
      const drawHandle = features?.find(isDrawHandle) as DrawPickingObject
      if (drawLayerMode instanceof ViewMode) {
        if (drawFeature) {
          setDrawFeaturesIndexes([(drawFeature as DrawPickingObject).index])
          setDrawLayerMode(new ModifyMode())
        } else {
          setDrawFeaturesIndexes([])
          setDrawLayerMode(new ViewMode())
        }
      }
      if (drawLayerMode instanceof ModifyMode) {
        if (drawFeature) {
          setDrawFeaturesIndexes([(drawFeature as DrawPickingObject).index])
        }
        if (drawHandle) {
          setUpdatedPoint({
            coordinates: drawHandle.geometry.coordinates,
            index: drawHandle.index,
          })
        }
        if (!drawFeature || !drawHandle) {
          setDrawLayerMode(new ViewMode())
        }
      }
    },
    [drawLayerMode, setDrawFeaturesIndexes, setDrawLayerMode, setUpdatedPoint]
  )

  const onDrawingMapHover = useCallback(
    (features: DeckLayerPickingObject[] | undefined) => {
      const drawFeature = features?.find(isDrawFeature)
      if (drawFeature) {
        setDrawFeaturesIndexes([(drawFeature as DrawPickingObject).index])
      } else {
        // setDrawLayerMode(new ViewMode())
      }
    },
    [setDrawFeaturesIndexes]
  )

  const removeDrawFeature = useCallback(() => {
    if (drawFeaturesIndexes.length) {
      const newFeatures = drawFeatures.features.filter((f, i) => drawFeaturesIndexes[0] !== i)
      setDrawFeatures({
        ...drawFeatures,
        features: newFeatures,
      })
    }
  }, [drawFeatures, drawFeaturesIndexes, setDrawFeatures])

  useEffect(() => {
    !isMapDrawing
      ? setLayerInstance(null)
      : setLayerInstance(
          new DrawLayer({
            data: drawFeatures,
            onEdit: onDrawEdit,
            selectedFeatureIndexes: drawFeaturesIndexes,
            mode: drawLayerMode,
          })
        )
  }, [drawFeatures, drawFeaturesIndexes, drawLayerMode, isMapDrawing, onDrawEdit, setLayerInstance])

  return {
    instance: layerInstance,
    onDrawClick,
    drawFeaturesIndexes,
    drawFeatures,
    setDrawFeatures,
    updatedPoint,
    resetDrawFeatures,
    isDrawSelectMode,
    onDrawingMapHover,
    setDrawLayerMode,
    hasOverlappingFeatures,
    removeDrawFeature,
    getDrawCursor,
  }
}
