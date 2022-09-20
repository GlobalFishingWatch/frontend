import { Color } from '@deck.gl/core/typed'
import { getFourwingsMode } from 'layers/fourwings/fourwings.utils'
import { FourwingsLayer, FourwingsLayerMode } from 'layers/fourwings/FourwingsLayer'
import { useCallback, useEffect } from 'react'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { useTimerange } from 'features/timebar/timebar.hooks'
import { useViewport } from 'features/map/map-viewport.hooks'
import { useMapLayers } from 'features/map/layers.hooks'

const dateToMs = (date: string) => {
  return new Date(date).getTime()
}

type FourwingsAtom = {
  colorRamp: {
    colorDomain: number[]
    colorRange: Color[]
  }
  instance?: FourwingsLayer
}

export const fourwingsLayerAtom = atom<FourwingsAtom>({
  key: 'fourwingsLayer',
  dangerouslyAllowMutability: true,
  default: {
    colorRamp: { colorDomain: [], colorRange: [] },
  },
})

export function useFourwingsLayer() {
  const [
    {
      colorRamp: { colorDomain, colorRange },
      instance,
    },
    updateFourwingsAtom,
  ] = useRecoilState(fourwingsLayerAtom)
  const [mapLayers] = useMapLayers()
  const [timerange] = useTimerange()
  const startTime = dateToMs(timerange.start)
  const endTime = dateToMs(timerange.end)
  const { viewState } = useViewport()
  const activityMode: FourwingsLayerMode = getFourwingsMode(viewState.zoom)

  const fourwingsMapLayerVisible = mapLayers.find((l) => l.id === 'fourwings')?.visible

  const onViewportLoad = useCallback(() => {
    if (instance) {
      const ramp = instance.getHeatmapColorRamp()
      console.log('updates ramp', ramp)
      updateFourwingsAtom(({ instance }) => ({ instance, colorRamp: ramp }))
    }
  }, [instance, updateFourwingsAtom])

  useEffect(() => {
    if (fourwingsMapLayerVisible) {
      const fourwingsLayer = new FourwingsLayer({
        minFrame: startTime,
        maxFrame: endTime,
        colorDomain,
        colorRange,
        onViewportLoad: onViewportLoad,
        mode: activityMode,
      })
      updateFourwingsAtom(({ colorRamp }) => ({ colorRamp, instance: fourwingsLayer }))
    } else {
      updateFourwingsAtom(({ colorRamp }) => ({ colorRamp, instance: undefined }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fourwingsMapLayerVisible,
    startTime,
    endTime,
    colorDomain,
    colorRange,
    updateFourwingsAtom,
    activityMode,
  ])

  return instance
}

const fourwingsInstanceAtomSelector = selector({
  key: 'fourwingsInstanceAtomSelector',
  get: ({ get }) => {
    return get(fourwingsLayerAtom)?.instance
  },
})
export function useFourwingsLayerInstance() {
  const instance = useRecoilValue(fourwingsInstanceAtomSelector)
  return instance
}

const fourwingsColorRampAtomSelector = selector({
  key: 'fourwingsColorRampAtomSelector',
  get: ({ get }) => {
    return get(fourwingsLayerAtom)?.colorRamp
  },
})
export function useFourwingsLayerRamp() {
  const colorRamp = useRecoilValue(fourwingsColorRampAtomSelector)
  return colorRamp
}
