import { Color } from '@deck.gl/core/typed'
import { getFourwingsMode } from 'layers/fourwings/fourwings.utils'
import {
  FourwingsColorRamp,
  FourwingsLayer,
  FourwingsLayerMode,
} from 'layers/fourwings/FourwingsLayer'
import { useCallback, useEffect } from 'react'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { useTimerange } from 'features/timebar/timebar.hooks'
import { useViewport } from 'features/map/map-viewport.hooks'
import { useMapLayers } from 'features/map/layers.hooks'

const dateToMs = (date: string) => {
  return new Date(date).getTime()
}

type FourwingsAtom = {
  colorRamp: FourwingsColorRamp
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

  const onColorRampUpdate = useCallback(
    (colorRamp: FourwingsColorRamp) => {
      if (colorRamp) {
        console.log('updates ramp', colorRamp)
        updateFourwingsAtom(({ instance }) => ({ instance, colorRamp }))
      }
    },
    [updateFourwingsAtom]
  )

  useEffect(() => {
    if (fourwingsMapLayerVisible) {
      const fourwingsLayer = new FourwingsLayer({
        minFrame: startTime,
        maxFrame: endTime,
        colorDomain,
        colorRange,
        // onViewportLoad: onViewportLoad,
        onColorRampUpdate: onColorRampUpdate,
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
  dangerouslyAllowMutability: true,
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
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    return get(fourwingsLayerAtom)?.colorRamp
  },
})
export function useFourwingsLayerRamp() {
  const colorRamp = useRecoilValue(fourwingsColorRampAtomSelector)
  return colorRamp
}
