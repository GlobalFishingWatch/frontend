import { useCallback, useEffect } from 'react'
import { FeatureCollection, GeoJSON, GeoJsonProperties, Geometry } from 'geojson'
import { atom, useSetAtom, useAtomValue, useAtom } from 'jotai'
// import { DrawPolygonMode, ModifyMode } from '@nebula.gl/edit-modes'

type DrawLayerMode = 'draw' | 'edit'
const drawFeaturesAtom = atom<FeatureCollection<Geometry, GeoJsonProperties>>({
  type: 'FeatureCollection',
  features: [],
})
const updatedPointAtom = atom<{ coordinates: [number, number]; index: number } | null>(null)
const drawFeaturesIndexesAtom = atom<number[]>([0])
const drawLayerModeAtom = atom<DrawLayerMode>('draw')

export const useDrawLayer = () => {
  const [drawFeatures, setDrawFeatures] = useAtom(drawFeaturesAtom)
  const [drawFeaturesIndexes, setDrawFeaturesIndexes] = useAtom(drawFeaturesIndexesAtom)
  const [drawLayerMode, setDrawLayerMode] = useAtom(drawLayerModeAtom)
  const [updatedPoint, setUpdatedPoint] = useAtom(updatedPointAtom)
  const onDrawEdit = useCallback(
    // TODO:deck fix types here
    ({ updatedData, editType }: any) => {
      if (editType === 'addFeature' || editType === 'movePosition' || editType === 'addPosition') {
        console.log('🚀 ~ useDrawLayer ~ updatedData:', updatedData)
        setDrawFeatures(updatedData)
        setDrawLayerMode('edit')
      }
    },
    [setDrawFeatures, setDrawLayerMode]
  )
  const onDrawClick = useCallback(
    // TODO:deck fix types here
    (info: any) => {
      console.log('🚀 ~ onDrawClick ~ info:', info)
      if (info.featureType === 'polygons') {
        setDrawFeaturesIndexes([info.index])
      }
      if (info.featureType === 'points') {
        setUpdatedPoint({
          coordinates: info.object.geometry.coordinates,
          index: info.index,
        })
      }
    },
    [setDrawFeaturesIndexes, setUpdatedPoint]
  )
  return {
    onDrawEdit,
    onDrawClick,
    drawLayerMode,
    drawFeaturesIndexes,
    drawFeatures,
    setDrawFeatures,
    updatedPoint,
  }
}
