import { useCallback, useEffect } from 'react'
import { FeatureCollection, GeoJSON, GeoJsonProperties, Geometry } from 'geojson'
import { atom, useSetAtom, useAtomValue, useAtom } from 'jotai'
import {
  CompositeMode,
  DrawPolygonMode,
  GeoJsonEditMode,
  ModifyMode,
  ViewMode,
} from '@deck.gl-community/editable-layers'
import {
  DeckLayerPickingObject,
  DrawPickingInfo,
  DrawPickingObject,
} from '@globalfishingwatch/deck-layers'
import { useDeckMap } from 'features/map/map-context.hooks'

type DrawLayerMode = DrawPolygonMode | GeoJsonEditMode | ViewMode | 'draw'
const drawFeaturesAtom = atom<FeatureCollection<Geometry, GeoJsonProperties>>({
  type: 'FeatureCollection',
  features: [],
})
const drawMode = new DrawPolygonMode()
const selectMode = new ViewMode()
const editModeInstance = new CompositeMode([new GeoJsonEditMode(), new ModifyMode()])
// const editModeInstance = new GeoJsonEditMode()
const updatedPointAtom = atom<{ coordinates: [number, number]; index: number } | null>(null)
const drawFeaturesIndexesAtom = atom<number[]>([0])
const drawLayerModeAtom = atom<DrawLayerMode>('draw')

export const useDrawLayer = () => {
  const map = useDeckMap()
  map && map.setProps({ controller: { doubleClickZoom: false } })
  const [drawFeatures, setDrawFeatures] = useAtom(drawFeaturesAtom)
  const [drawFeaturesIndexes, setDrawFeaturesIndexes] = useAtom(drawFeaturesIndexesAtom)
  const [drawLayerMode, setDrawLayerMode] = useAtom(drawLayerModeAtom)
  const [updatedPoint, setUpdatedPoint] = useAtom(updatedPointAtom)
  const resetDrawFeatures = useCallback(() => {
    setDrawFeatures({
      type: 'FeatureCollection',
      features: [],
    })
    setDrawFeaturesIndexes([0])
    setDrawLayerMode(selectMode)
  }, [setDrawFeatures, setDrawFeaturesIndexes, setDrawLayerMode])
  const onDrawEdit = useCallback(
    // TODO:deck fix types here
    ({ updatedData, editType }: any) => {
      if (editType === 'addFeature' || editType === 'movePosition' || editType === 'addPosition') {
        setDrawLayerMode(selectMode)
        setDrawFeatures(updatedData)
      }
    },
    [setDrawFeatures, setDrawLayerMode]
  )
  const isDrawFeature = (feature: DeckLayerPickingObject) => {
    return (
      feature.category === 'draw' && (feature as DrawPickingObject).geometry?.type === 'Polygon'
    )
  }
  const onDrawClick = useCallback(
    (features: DeckLayerPickingObject[] | undefined) => {
      if (drawLayerMode instanceof ViewMode) {
        const drawFeature = features?.find(isDrawFeature)
        if (drawFeature) {
          setDrawFeaturesIndexes([(drawFeature as DrawPickingObject).index])
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
    [drawLayerMode, setDrawFeaturesIndexes]
  )
  return {
    onDrawEdit,
    onDrawClick,
    drawLayerMode,
    drawFeaturesIndexes,
    drawFeatures,
    setDrawFeatures,
    updatedPoint,
    resetDrawFeatures,
  }
}
