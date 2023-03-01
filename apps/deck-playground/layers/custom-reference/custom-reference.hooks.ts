import { useCallback, useEffect } from 'react'
import { GeoJSON } from 'geojson'
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { CustomReferenceLayer } from 'layers/custom-reference/CustomReferenceLayer'
import { useMapLayers } from 'features/map/layers.hooks'

type customReferenceAtom = {
  loaded: boolean
  instance?: CustomReferenceLayer
  data: GeoJSON | null
  mode: 'draw' | 'edit'
  selectedFeatureIndexes: number[]
}

export const customReferenceLayerAtom = atom<customReferenceAtom>({
  key: 'customReferenceLayer',
  dangerouslyAllowMutability: true,
  default: {
    mode: 'draw',
    loaded: false,
    selectedFeatureIndexes: [0],
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  },
})

export function useCustomReferenceLayer() {
  const [{ instance, data, mode, selectedFeatureIndexes }, updateAtom] =
    useRecoilState(customReferenceLayerAtom)
  const [mapLayers] = useMapLayers()

  const layer = mapLayers.find((l) => l.id === 'custom-reference')
  const layerVisible = layer?.visible

  const setAtomProperty = useCallback(
    (property) => updateAtom((state) => ({ ...state, ...property })),
    [updateAtom]
  )

  const onEdit = useCallback(
    ({ updatedData, editType }) => {
      if (editType === 'addFeature' || editType === 'movePosition' || editType === 'addPosition') {
        setAtomProperty({ data: updatedData })
      }
    },
    [setAtomProperty]
  )

  const onClick = useCallback(
    (info) => {
      if (info.featureType === 'polygons') {
        setAtomProperty({ selectedFeatureIndexes: [info.index] })
      }
      console.log('clicked', info)
    },
    [setAtomProperty]
  )

  useEffect(() => {
    if (layerVisible) {
      const customReferenceLayer = new CustomReferenceLayer({
        data,
        onEdit,
        onClick,
        mode,
        selectedFeatureIndexes,
      })
      setAtomProperty({ instance: customReferenceLayer })
    } else {
      setAtomProperty({ instance: undefined, loaded: false })
    }
  }, [
    data,
    onEdit,
    onClick,
    mode,
    updateAtom,
    layerVisible,
    setAtomProperty,
    selectedFeatureIndexes,
  ])

  return instance
}

export function useUpdateMode() {
  const setCustomReferenceAtom = useSetRecoilState(customReferenceLayerAtom)
  const setMode = useCallback(
    (mode: customReferenceAtom['mode']) => {
      setCustomReferenceAtom((atom) => {
        return { ...atom, mode }
      })
    },
    [setCustomReferenceAtom]
  )
  return setMode
}

const customReferenceInstanceAtomSelector = selector({
  key: 'customReferenceInstanceAtomSelector',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(customReferenceLayerAtom)?.instance
  },
})

export function useCustomReferenceInstance() {
  const instance = useRecoilValue(customReferenceInstanceAtomSelector)
  return instance
}

const customReferenceModeAtomSelector = selector({
  key: 'customReferenceModeAtomSelector',
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(customReferenceLayerAtom)?.mode
  },
})

export function useCustomReferenceMode() {
  const mode = useRecoilValue(customReferenceModeAtomSelector)
  return mode
}
