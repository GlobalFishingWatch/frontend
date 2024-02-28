import { useCallback, useEffect } from 'react'
import { useAtom, atom } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { BaseMapLayer, BasemapLayerOwnProps } from '@globalfishingwatch/deck-layers'

type basemapLayerAtomType = {
  loaded: boolean
  instance?: BaseMapLayer
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
      const basemapLayer = new BaseMapLayer({
        onDataLoad: onDataLoad,
        basemap: basemap,
      })
      updateAtom({ instance: basemapLayer, loaded })
    } else {
      updateAtom({ instance: undefined, loaded: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, basemap])
  return instance
}

export function useBasemapLayerInstance() {
  return selectAtom(basemapLayerAtom, (layer: basemapLayerAtomType) => layer.instance)
}
