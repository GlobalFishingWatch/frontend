import { useCallback, useEffect, useState } from 'react'
import { FeatureCollection, GeoJSON, GeoJsonProperties, Geometry } from 'geojson'
import { atom, useSetAtom, useAtomValue, useAtom } from 'jotai'
import {
  CompositeMode,
  DrawPolygonMode,
  GeoJsonEditMode,
  ModifyMode,
  TranslateMode,
  ViewMode,
} from '@deck.gl-community/editable-layers'
import {
  DeckLayerPickingObject,
  DrawLayer,
  DrawPickingObject,
} from '@globalfishingwatch/deck-layers'
import { useDeckMap } from 'features/map/map-context.hooks'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'

type DrawLayerMode = DrawPolygonMode | ViewMode | 'draw'
const drawFeaturesAtom = atom<FeatureCollection<Geometry, GeoJsonProperties>>({
  type: 'FeatureCollection',
  features: [],
})
export const drawMode = new DrawPolygonMode()
const selectMode = () => ViewMode
const editModeInstance = new CompositeMode([new GeoJsonEditMode(), new ModifyMode()])
// const editModeInstance = new GeoJsonEditMode()
const updatedPointAtom = atom<{ coordinates: [number, number]; index: number } | null>(null)
const drawFeaturesIndexesAtom = atom<number[]>([0])
const drawLayerModeAtom = atom<DrawLayerMode>('draw')

export const useDrawLayer = () => {
  const map = useDeckMap()
  const { isMapDrawing } = useMapDrawConnect()
  map && map.setProps({ controller: { doubleClickZoom: false } })
  const [drawFeatures, setDrawFeatures] = useAtom(drawFeaturesAtom)
  const [drawFeaturesIndexes, setDrawFeaturesIndexes] = useAtom(drawFeaturesIndexesAtom)
  const [drawLayerMode, setDrawLayerMode] = useAtom(drawLayerModeAtom)
  const [updatedPoint, setUpdatedPoint] = useAtom(updatedPointAtom)
  // const [drawLayerMode, setDrawLayerMode] = useState<DrawLayerMode>('draw')
  const resetDrawFeatures = useCallback(() => {
    setDrawFeatures({
      type: 'FeatureCollection',
      features: [],
    })
    setDrawFeaturesIndexes([0])
    setDrawLayerMode(new ViewMode())
  }, [setDrawFeatures, setDrawFeaturesIndexes, setDrawLayerMode])

  const onDrawEdit = useCallback(
    // TODO:deck fix types here
    ({ updatedData, editType }: any) => {
      if (editType === 'addFeature' || editType === 'addPosition') {
        setDrawLayerMode(new ViewMode())
        setDrawFeatures(updatedData)
        setDrawFeaturesIndexes([])
      }
      if (editType === 'movePosition') {
        setDrawFeatures(updatedData)
      }
    },
    [setDrawFeatures, setDrawFeaturesIndexes, setDrawLayerMode]
  )
  const isDrawFeature = (feature: DeckLayerPickingObject) => {
    return (
      feature.category === 'draw' && (feature as DrawPickingObject).geometry?.type === 'Polygon'
    )
  }

  const isDrawSelectMode = useCallback(() => {
    return drawLayerMode instanceof ViewMode
  }, [drawLayerMode])

  const onDrawClick = useCallback(
    (features: DeckLayerPickingObject[] | undefined) => {
      if (drawLayerMode instanceof ViewMode) {
        const drawFeature = features?.find(isDrawFeature)
        if (drawFeature) {
          setDrawLayerMode(new ModifyMode())
        } else {
          setDrawFeaturesIndexes([])
        }
      }
      // if (info.object) {
      //   console.log('changing to edit mode')
      //   setDrawLayerMode(selectModeInstance)
      //   return console.log(info.object)
      // }
      // console.log('🚀 ~ useDrawLayer ~ editModeInstance:', editModeInstance)
      // if (info.featureType === 'polygons') {
      //   setDrawFeaturesIndexes([info.index])
      // }
      // if (info.featureType === 'points') {
      //   setUpdatedPoint({
      //     coordinates: info.object.geometry.coordinates,
      //     index: info.index,
      //   })
      // }
    },
    [drawLayerMode, setDrawFeaturesIndexes, setDrawLayerMode]
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
  const instance = isMapDrawing
    ? new DrawLayer({
        data: drawFeatures,
        onEdit: onDrawEdit,
        // onClick: onDrawClick,
        selectedFeatureIndexes: drawFeaturesIndexes,
        mode: drawLayerMode,
      })
    : null

  return {
    instance,
    onDrawClick,
    drawFeaturesIndexes,
    drawFeatures,
    setDrawFeatures,
    updatedPoint,
    resetDrawFeatures,
    isDrawSelectMode,
    onDrawingMapHover,
  }
}
