import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import type { Deck, PickingInfo } from '@deck.gl/core'
import type { DeckGLRef } from '@deck.gl/react'
import { throttle } from 'es-toolkit'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { DateTime } from 'luxon'

import type { DataviewInstance } from '@globalfishingwatch/api-types'
import { useDeckLayerComposer } from '@globalfishingwatch/deck-layer-composer'
import type { TrackLabelerPoint } from '@globalfishingwatch/deck-layers'
import { hexToDeckColor, TrackLabelerVesselLayer } from '@globalfishingwatch/deck-layers'

import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE, DEFAULT_VIEWPORT } from '../../data/config'
import { selectEditing } from '../../features/rulers/rulers.selectors'
import { editRuler, moveCurrentRuler } from '../../features/rulers/rulers.slice'
import { updateQueryParams } from '../../routes/routes.actions'
import { selectHiddenLabels } from '../../routes/routes.selectors'
import { useAppDispatch } from '../../store.hooks'
import type { Label, MapCoordinates } from '../../types'
import { useSegmentsLabeledConnect } from '../timebar/timebar.hooks'
import { selectHighlightedTime } from '../timebar/timebar.slice'
import { selectedtracks } from '../vessels/selectedTracks.slice'

import { selectDirectionPointsData, selectLegendLabels } from './map.selectors'

export const useMapMove = () => {
  const dispatch = useAppDispatch()
  const rulersEditing = useSelector(selectEditing)
  const [hoverCenter, setHoverCenter] = useState<LatLon | null>(null)
  const onMapMove = useCallback(
    (event: any) => {
      const center = {
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
      }
      setHoverCenter(center)
      if (rulersEditing === true) {
        dispatch(moveCurrentRuler(center))
      }
    },
    [dispatch, rulersEditing]
  )
  return { onMapMove, hoverCenter }
}

export const useMapClick = () => {
  const dispatch = useAppDispatch()
  const rulersEditing = useSelector(selectEditing)
  const { onEventPointClick } = useSegmentsLabeledConnect()
  const segments = useSelector(selectedtracks)
  const onEventClick = useCallback(
    (feature: TrackLabelerPoint) => {
      onEventPointClick(segments, feature.timestamp, {
        latitude: feature.position[0],
        longitude: feature.position[1],
      })
    },
    [onEventPointClick, segments]
  )
  const onMapClick = useCallback(
    (info: PickingInfo) => {
      if (!rulersEditing && info.object) {
        onEventClick(info.object)
      } else {
        if (rulersEditing === true && info.coordinate) {
          dispatch(
            editRuler({
              longitude: info.coordinate[0],
              latitude: info.coordinate[1],
            })
          )
        }
      }
    },
    [rulersEditing, onEventClick, dispatch]
  )
  return { onMapClick }
}

export type LatLon = {
  latitude: number
  longitude: number
}
export type HighlightedTime = { start: string; end: string }

const viewStateAtom = atom<MapCoordinates>({
  longitude: DEFAULT_VIEWPORT.longitude,
  latitude: DEFAULT_VIEWPORT.latitude,
  zoom: DEFAULT_VIEWPORT.zoom,
})

export const useMapViewState = () => {
  return useAtomValue(viewStateAtom)
}
export const useMapSetViewState = () => {
  const setViewState = useSetAtom(viewStateAtom)
  return useMemo(
    () =>
      throttle((coordinates: Partial<MapCoordinates>) => {
        setViewState((prev) => ({ ...prev, ...coordinates }))
      }, 1),
    [setViewState]
  )
}

export const useHiddenLabelsConnect = () => {
  const dispatch = useAppDispatch()
  const hiddenLabels = useSelector(selectHiddenLabels)

  const dispatchHiddenLabels = (labelName: Label['name']) => {
    const newLabels = hiddenLabels.includes(labelName)
      ? hiddenLabels.filter((label: Label['name']) => label !== labelName)
      : [...hiddenLabels, labelName]

    dispatch(
      updateQueryParams({
        hiddenLabels: newLabels.length ? newLabels.join(',') : undefined,
      })
    )
  }

  return { dispatchHiddenLabels, hiddenLabels }
}

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

export const useMapDataviewLayers = () => {
  const dataviews = useMemo(
    () => {
      // if (isWorkspaceIndexLocation || isUserLocation) {
      //   const dataviews = [DEFAULT_BASEMAP_DATAVIEW_INSTANCE]
      //   if (workspacesListDataview) {
      //     dataviews.push(workspacesListDataview as DataviewInstance)
      //   }
      //   return dataviews
      // }
      // if (workspaceLoading) {
      //   return [DEFAULT_BASEMAP_DATAVIEW_INSTANCE]
      // }
      return [DEFAULT_BASEMAP_DATAVIEW_INSTANCE]
    },
    [
      // bufferDataviews,
      // isWorkspaceIndexLocation,
      // isUserLocation,
      // workspaceDataviews,
      // workspaceLoading,
      // workspacesListDataview,
    ]
  )

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
  const layers = useMapDataviewLayers()

  const allLayers = useMemo(() => {
    if (labelerLayer) {
      return [...layers, labelerLayer]
    }
    return layers
  }, [layers, labelerLayer])

  return allLayers
}

const mapInstanceAtom = atom<DeckGLRef | undefined>(undefined)

export function useSetMapInstance(mapRef: RefObject<DeckGLRef | null> | undefined) {
  const setMapInstance = useSetAtom(mapInstanceAtom)
  useEffect(() => {
    if (mapRef?.current?.deck) {
      setMapInstance(mapRef?.current?.deck)
    }
  }, [mapRef?.current])
}

export function useDeckMap(): Deck {
  return useAtomValue(mapInstanceAtom) as Deck
}
