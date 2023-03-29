import { useCallback, useEffect } from 'react'
import { useAtom, atom } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { BaseMap, BasemapLayerOwnProps } from './BasemapLayer'

type basemapLayerAtomType = {
  loaded: boolean
  instance?: BaseMap
}

export const basemapLayerAtom = atom<basemapLayerAtomType>({
  loaded: false,
})

export function useBasemapLayer({
  visible,
  basemap,
}: {
  visible: boolean
  basemap: BasemapLayerOwnProps['basemap']
}) {
  const [{ instance, loaded }, updateAtom] = useAtom(basemapLayerAtom)

  const onDataLoad = useCallback(() => {
    updateAtom({ loaded: true })
  }, [updateAtom])

  useEffect(() => {
    if (visible) {
      const basemapLayer = new BaseMap({
        onDataLoad: onDataLoad,
        basemap: basemap,
      })
      updateAtom({ instance: basemapLayer, loaded })
    } else {
      updateAtom({ instance: undefined, loaded: false })
    }
  }, [visible, basemap, onDataLoad, updateAtom, loaded])
  return instance
}

export function useBasemapLayerInstance() {
  return selectAtom(basemapLayerAtom, (layer: basemapLayerAtomType) => layer.instance)
}
