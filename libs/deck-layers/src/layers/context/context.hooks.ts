import { useCallback, useEffect } from 'react'
import { PickingInfo } from '@deck.gl/core/typed'
import { useAtom, atom } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { ContextLayer } from './ContextLayer'

type ContextsLayerAtomType = {
  loaded: boolean
  instance?: ContextLayer
}

export const contextsLayerAtom = atom<ContextsLayerAtomType>({
  loaded: false,
})

export function useContextsLayer({
  id,
  color,
  visible,
  datasetId,
  hoveredFeatures,
  clickedFeatures,
}: {
  id: string
  color: string
  visible: boolean
  datasetId: string
  hoveredFeatures: PickingInfo[]
  clickedFeatures: PickingInfo[]
}) {
  const [{ instance, loaded }, updateAtom] = useAtom(contextsLayerAtom)

  const onDataLoad = useCallback(() => {
    updateAtom({ loaded: true })
  }, [updateAtom])

  useEffect(() => {
    if (visible) {
      const contextLayer = new ContextLayer({
        hoveredFeatures,
        clickedFeatures,
        color,
        datasetId,
        id,
        onDataLoad: onDataLoad,
      })
      updateAtom({ instance: contextLayer, loaded })
    } else {
      updateAtom({ instance: undefined, loaded: false })
    }
  }, [
    visible,
    updateAtom,
    hoveredFeatures,
    clickedFeatures,
    color,
    datasetId,
    loaded,
    id,
    onDataLoad,
  ])

  return instance
}

export function useContextsLayerInstance() {
  return selectAtom(contextsLayerAtom, (layer: ContextsLayerAtomType) => layer.instance)
}
