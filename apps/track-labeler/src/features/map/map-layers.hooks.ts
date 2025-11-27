import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'

import type { DataviewInstance } from '@globalfishingwatch/api-types'
import { useDeckLayerComposer } from '@globalfishingwatch/deck-layer-composer'
import {
  hexToDeckColor,
  RulersLayer,
  TrackLabelerVesselLayer,
} from '@globalfishingwatch/deck-layers'

import { selectRulers } from '../rulers/rulers.selectors'
import { selectHighlightedTime } from '../timebar/timebar.slice'

import { useHiddenLabelsConnect } from './map.hooks'
import { selectDirectionPointsData, selectLegendLabels } from './map.selectors'
import { getContextualLayersDataviews } from './map-layers.selectors'

export const useTrackLabelerDeckLayer = () => {
  const legengLabels = useSelector(selectLegendLabels)
  const highlightedTime = useSelector(selectHighlightedTime)
  const pointsData = useSelector(selectDirectionPointsData)
  const { hiddenLabels } = useHiddenLabelsConnect()

  const visibleLabels = useMemo(() => {
    return legengLabels.flatMap((label) => (!hiddenLabels.includes(label.id) ? label.id : []))
  }, [legengLabels, hiddenLabels])

  const formattedTime: { start: number; end: number } | null = useMemo(() => {
    if (highlightedTime?.start && highlightedTime?.end) {
      return {
        start: DateTime.fromISO(highlightedTime.start).toMillis(),
        end: DateTime.fromISO(highlightedTime.end).toMillis(),
      }
    }
    return null
  }, [highlightedTime])

  const layer = useMemo(() => {
    if (!pointsData || !pointsData.length) {
      return null
    }

    const vesselLayer = new TrackLabelerVesselLayer({
      id: 'track-points',
      data: pointsData || [],
      pickable: true,
      iconAtlasUrl: 'src/assets/images/vessel-sprite.png',
      highlightedTime,
      visibleLabels,
      getColor: (d) => hexToDeckColor(d.color, 0.8),
      getHighlightColor: (d) => {
        if (
          formattedTime &&
          d.timestamp >= formattedTime.start &&
          d.timestamp <= formattedTime.end
        ) {
          return [255, 255, 255, 200]
        }
        return [0, 0, 0, 0]
      },
    })

    return vesselLayer
  }, [pointsData, highlightedTime, formattedTime, visibleLabels])

  return layer
}

export const useMapRulerInstance = () => {
  const rulers = useSelector(selectRulers)
  return useMemo(() => {
    if (rulers?.length) {
      return new RulersLayer({
        rulers,
        visible: true,
      })
    }
  }, [rulers])
}

export const useMapDataviewLayers = () => {
  const dataviews = useSelector(getContextualLayersDataviews)

  const layers = useDeckLayerComposer({
    dataviews: dataviews as DataviewInstance[],
    globalConfig: {
      start: '2019-07-01T00:00:00.000Z',
      end: '2019-07-01T00:00:00.000Z',
      bivariateDataviews: null,
      visibleEvents: [],
      vesselsColorBy: 'track',
    },
  })

  return layers
}

export const useMapDeckLayers = () => {
  const labelerLayer = useTrackLabelerDeckLayer()
  const rulersLayer = useMapRulerInstance()
  const layers = useMapDataviewLayers()

  const allLayers = useMemo(() => {
    return [...layers, labelerLayer, rulersLayer].filter(Boolean)
  }, [layers, labelerLayer, rulersLayer])

  return allLayers
}
