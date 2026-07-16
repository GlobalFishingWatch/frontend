import { useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useAtomValue } from 'jotai'

import {
  deckLayerInstancesAtom,
  useDeckLayerLoadedState,
  useMapHoverInteraction,
} from '@globalfishingwatch/deck-layer-composer'
import type { ContextFeature, DeckLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { getUTCDateTime, POSITIONS_ID } from '@globalfishingwatch/deck-layers'
import type { FourwingsFeatureProperties } from '@globalfishingwatch/deck-loaders'
import { useMemoCompare } from '@globalfishingwatch/react-hooks'

import {
  selectReportAreaDataviews,
  selectReportAreaHighlightedFeature,
} from 'features/reports/report-area/area-reports.selectors'
import { selectHighlightedEvents, selectHighlightedTime } from 'features/timebar/timebar.slice'
import {
  selectTrackCorrectionTimerange,
  selectTrackCorrectionVesselDataviewId,
} from 'features/track-correction/track-correction.slice'
import { selectTrackCorrectionId } from 'router/routes.selectors'

import { selectClickedEvent } from './map.slice'

type SyncableLayer = {
  id: string
  state?: unknown
  setHighlightedFeatures?: (features: DeckLayerPickingObject[]) => void
  setHighlightedTime?: (range: { start?: number; end?: number }) => void
  setHighlightEventIds?: (ids: string[]) => void
  getVisualizationMode?: () => string
}

// Per-layer hashes so each highlight kind only re-applies imperatively when its own value changed.
type LayerHighlightHashes = { features?: string; time?: string; events?: string }

const EMPTY_HOVER_FEATURES: DeckLayerPickingObject[] = []

function getHoverFeaturesHash(features: DeckLayerPickingObject[] = []) {
  return features
    .map((feature) => {
      const propertyId =
        'properties' in feature
          ? (feature.properties as FourwingsFeatureProperties)?.cellId || ''
          : 'timestamp' in feature
            ? (feature.timestamp as number) || ''
            : ''
      return `${feature.category}-${feature.layerId}-${feature.id}-${propertyId}`
    })
    .join('|')
}

function getLayerHoverFeatures(layer: SyncableLayer, features: DeckLayerPickingObject[] = []) {
  return features.filter((feature) => {
    if (!feature.layerId) return false
    return layer.id.includes(feature.layerId) || feature.layerId.includes(layer.id)
  })
}

function getLayerHighlightedFeatures(
  layer: SyncableLayer,
  features: DeckLayerPickingObject[],
  reportAreaHighlightedFeature: ContextFeature | undefined,
  reportAreaDataviewIds: string[]
) {
  const layerFeatures = getLayerHoverFeatures(layer, features)
  if (reportAreaHighlightedFeature && reportAreaDataviewIds.includes(layer.id)) {
    return [reportAreaHighlightedFeature as DeckLayerPickingObject, ...layerFeatures]
  }
  return layerFeatures
}

function toHighlightTimeMillis(time?: { start?: string; end?: string }) {
  if (!time?.start || !time?.end) {
    return null
  }
  return {
    start: getUTCDateTime(time.start).toMillis(),
    end: getUTCDateTime(time.end).toMillis(),
  }
}

export const useSyncMapHighlights = () => {
  const layers = useAtomValue(deckLayerInstancesAtom) as SyncableLayer[]
  const layersLoadedState = useDeckLayerLoadedState()
  const hashRef = useRef<Record<string, LayerHighlightHashes>>({})

  const reportAreaHighlightedFeature = useSelector(selectReportAreaHighlightedFeature)
  const reportAreaDataviews = useSelector(selectReportAreaDataviews)
  const reportAreaDataviewIds = useMemo(
    () => reportAreaDataviews?.map((d) => d.id) ?? [],
    [reportAreaDataviews]
  )
  const clickedEvent = useSelector(selectClickedEvent)
  const highlightedFeatures = useMemoCompare(
    [
      ...((clickedEvent?.features ?? []) as DeckLayerPickingObject[]),
      ...(useMapHoverInteraction()?.features ?? EMPTY_HOVER_FEATURES),
    ],
    (previousFeatures, nextFeatures) => {
      return getHoverFeaturesHash(previousFeatures) === getHoverFeaturesHash(nextFeatures)
    }
  )

  const timebarHighlightedTime = useSelector(selectHighlightedTime)
  const trackCorrectionVesselDataviewId = useSelector(selectTrackCorrectionVesselDataviewId)
  const trackCorrectionId = useSelector(selectTrackCorrectionId)
  const trackCorrectionTimerange = useSelector(selectTrackCorrectionTimerange)
  const timebarHighlightedTimeMillis = useMemo(
    () => toHighlightTimeMillis(timebarHighlightedTime),
    [timebarHighlightedTime]
  )
  const trackCorrectionTimerangeMillis = useMemo(
    () => toHighlightTimeMillis(trackCorrectionTimerange),
    [trackCorrectionTimerange]
  )

  const highlightEventIds = useSelector(selectHighlightedEvents)

  useEffect(() => {
    layers.forEach((layer) => {
      if (!layer.state) {
        return
      }
      const hashes = (hashRef.current[layer.id] ??= {})

      // Highligh features
      if (typeof layer.setHighlightedFeatures === 'function') {
        const layerFeatures = getLayerHighlightedFeatures(
          layer,
          highlightedFeatures,
          reportAreaHighlightedFeature,
          reportAreaDataviewIds
        )
        const hash = getHoverFeaturesHash(layerFeatures)
        if (hashes.features !== hash) {
          hashes.features = hash
          layer.setHighlightedFeatures(layerFeatures)
        }
      }

      // Highlight time
      if (typeof layer.setHighlightedTime === 'function') {
        const visualizationMode = layer.getVisualizationMode?.()
        const usesTimeHighlight =
          visualizationMode === undefined || visualizationMode === POSITIONS_ID
        if (usesTimeHighlight) {
          let highlightedTimeMillis = timebarHighlightedTimeMillis
          if (layer.id === trackCorrectionVesselDataviewId && trackCorrectionTimerangeMillis) {
            highlightedTimeMillis =
              trackCorrectionId !== 'new' && timebarHighlightedTimeMillis
                ? timebarHighlightedTimeMillis
                : trackCorrectionTimerangeMillis
          }
          const hash = highlightedTimeMillis
            ? `${highlightedTimeMillis.start}|${highlightedTimeMillis.end}`
            : ''
          if (hashes.time !== hash) {
            hashes.time = hash
            layer.setHighlightedTime(highlightedTimeMillis ?? { start: undefined, end: undefined })
          }
        }
      }

      // Highligh events
      if (typeof layer.setHighlightEventIds === 'function') {
        const eventsHash = (highlightEventIds || []).join(',')
        if (hashes.events !== eventsHash) {
          hashes.events = eventsHash
          layer.setHighlightEventIds(highlightEventIds || [])
        }
      }
    })
  }, [
    layers,
    layersLoadedState,
    highlightedFeatures,
    reportAreaDataviewIds,
    reportAreaHighlightedFeature,
    timebarHighlightedTimeMillis,
    trackCorrectionTimerangeMillis,
    trackCorrectionVesselDataviewId,
    trackCorrectionId,
    highlightEventIds,
  ])
}
