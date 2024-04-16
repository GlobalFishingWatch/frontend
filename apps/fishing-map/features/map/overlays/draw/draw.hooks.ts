import { useCallback, useEffect } from 'react'
import { GeoJSON } from 'geojson'
import { atom, useSetAtom, useAtomValue, useAtom } from 'jotai'
// import { DrawPolygonMode, ModifyMode } from '@nebula.gl/edit-modes'

type DrawLayerMode = 'draw' | 'edit'
const drawFeaturesAtom = atom<GeoJSON>({
  type: 'FeatureCollection',
  features: [],
})
const drawFeaturesIndexesAtom = atom<number[]>([0])
const drawLayerModeAtom = atom<DrawLayerMode>('draw')

export const useDrawLayer = () => {
  const [drawFeatures, setDrawFeatures] = useAtom(drawFeaturesAtom)
  const [drawFeaturesIndexes, setDrawFeaturesIndexes] = useAtom(drawFeaturesIndexesAtom)
  const [drawLayerMode, setDrawLayerMode] = useAtom(drawLayerModeAtom)
  const onDrawEdit = useCallback(
    // TODO:deck fix types here
    ({ updatedData, editType }: any) => {
      console.log('🚀 ~ useDrawLayer ~ updatedData, editType:', updatedData, editType)
      if (editType === 'addFeature' || editType === 'movePosition' || editType === 'addPosition') {
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
    },
    [setDrawFeaturesIndexes]
  )
  return { onDrawEdit, onDrawClick, drawLayerMode, drawFeaturesIndexes, drawFeatures }
}
