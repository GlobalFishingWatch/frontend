import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import type { Deck, PickingInfo } from '@deck.gl/core'
import type { DeckGLRef } from '@deck.gl/react'
import { throttle } from 'es-toolkit'
import { atom, useAtomValue, useSetAtom } from 'jotai'

import type { TrackLabelerPoint } from '@globalfishingwatch/deck-layers'

import { DEFAULT_VIEWPORT } from '../../data/config'
import { selectEditing } from '../../features/rulers/rulers.selectors'
import { editRuler, moveCurrentRuler } from '../../features/rulers/rulers.slice'
import { updateQueryParams } from '../../routes/routes.actions'
import { selectHiddenLabels } from '../../routes/routes.selectors'
import { useAppDispatch } from '../../store.hooks'
import type { Label, MapCoordinates } from '../../types'
import { useSegmentsLabeledConnect } from '../timebar/timebar.hooks'
import { selectedtracks } from '../vessels/selectedTracks.slice'

export const useMapHover = () => {
  const dispatch = useAppDispatch()
  const rulersEditing = useSelector(selectEditing)
  const [cursor, setCursor] = useState('default')

  const handleDeckHover = useCallback(
    (info: PickingInfo) => {
      const isHovering = Boolean(info.object)
      setCursor(isHovering ? 'pointer' : 'default')
      if (rulersEditing === true && info.coordinate) {
        dispatch(
          moveCurrentRuler({
            latitude: info.coordinate[1],
            longitude: info.coordinate[0],
          })
        )
      }

      return isHovering
    },
    [dispatch, rulersEditing]
  )
  return { cursor, handleDeckHover }
}

export const useMapClick = () => {
  const dispatch = useAppDispatch()
  const rulersEditing = useSelector(selectEditing)
  const { onEventPointClick } = useSegmentsLabeledConnect()
  const segments = useSelector(selectedtracks)
  const onEventClick = useCallback(
    (feature: TrackLabelerPoint) => {
      onEventPointClick(segments, feature.timestamp, {
        latitude: feature.position?.[0],
        longitude: feature.position?.[1],
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
