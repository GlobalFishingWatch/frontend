import { useCallback, useEffect } from 'react'
import { GeoJSON } from 'geojson'
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { CustomReferenceLayer } from 'layers/custom-reference/CustomReferenceLayer'
import { useMapLayers } from 'features/map/layers.hooks'

type customReferenceAtom = {
  loaded: boolean
  instance?: CustomReferenceLayer
  layerGeometry: GeoJSON | null
  editMode: 'draw' | 'edit'
}

export const customReferenceLayerAtom = atom<customReferenceAtom>({
  key: 'customReferenceLayer',
  dangerouslyAllowMutability: true,
  default: {
    editMode: 'draw',
    loaded: false,
    layerGeometry: {
      type: 'FeatureCollection',
      features: [],
    },
  },
})

export function useCustomReferenceLayer() {
  const [{ instance, layerGeometry, editMode }, updateAtom] =
    useRecoilState(customReferenceLayerAtom)
  const [mapLayers] = useMapLayers()

  const layer = mapLayers.find((l) => l.id === 'custom-reference')
  const layerVisible = layer?.visible

  const setAtomProperty = useCallback(
    (property) => updateAtom((state) => ({ ...state, ...property })),
    [updateAtom]
  )

  const onEdit = useCallback(
    ({ updatedData }) => {
      setAtomProperty({ layerGeometry: updatedData })
    },
    [setAtomProperty]
  )

  useEffect(() => {
    if (layerVisible) {
      console.log('editMode', editMode)
      const customReferenceLayer = new CustomReferenceLayer({
        onEdit,
        data: layerGeometry,
        editMode,
      })
      setAtomProperty({ instance: customReferenceLayer })
    } else {
      setAtomProperty({ instance: undefined, loaded: false })
    }
  }, [updateAtom, setAtomProperty, layerVisible, onEdit, layerGeometry, editMode])

  return instance
}

export function useUpdateMode() {
  const setCustomReferenceAtom = useSetRecoilState(customReferenceLayerAtom)
  const setMode = useCallback(
    (editMode: string) => {
      console.log('uppdating mode', editMode)
      setCustomReferenceAtom((atom) => {
        return { ...atom, editMode }
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
    return get(customReferenceLayerAtom)?.editMode
  },
})

export function useCustomReferenceMode() {
  const mode = useRecoilValue(customReferenceModeAtomSelector)
  return mode
}
