import { useEffect, useLayoutEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { MapViewProps, WebMercatorViewport } from '@deck.gl/core'
import { MapView } from '@deck.gl/core'
import { debounce } from 'es-toolkit'
import { useAtomValue, useSetAtom } from 'jotai'

import { viewStateAtom } from 'features/_map/map/map.atoms'
import { useDeckMap } from 'features/_map/map/map-context.hooks'
import { selectIsWorkspaceReady } from 'features/_map/workspace/workspace.selectors'
import { useReplaceQueryParams } from 'router/routes.hook'
import type { WorkspaceViewport } from 'types'
import { getIsBrowser } from 'utils/dom'
import { getUrlViewstateNumericParam } from 'utils/url'

export const useMapViewState = () => {
  return useAtomValue(viewStateAtom)
}

// Runs before paint on the client, no-ops on the server.
const useIsomorphicLayoutEffect = getIsBrowser() ? useLayoutEffect : useEffect

export const useMapViewStateUrlSync = () => {
  const setViewState = useSetAtom(viewStateAtom)
  useIsomorphicLayoutEffect(() => {
    const longitude = getUrlViewstateNumericParam('longitude')
    const latitude = getUrlViewstateNumericParam('latitude')
    const zoom = getUrlViewstateNumericParam('zoom')
    const urlViewport = Object.fromEntries(
      Object.entries({ longitude, latitude, zoom }).filter(([, value]) => value !== null)
    )
    if (Object.keys(urlViewport).length > 0) {
      setViewState((prev) => ({ ...prev, ...urlViewport }))
    }
    // mount-only: URL viewport is the initial deep-link, not a live source
  }, [])
}
// Moved to map-view-state.hooks so always-loaded callers (MainNav) can set the camera without pulling
// @deck.gl/core, which this module imports as a value for MAP_VIEW. Re-exported for existing consumers.
export {
  useMapSetViewState,
  useMapSize,
  useSetMapCoordinates,
} from 'features/_map/map/map-view-state.hooks'

const VIEW_STATE_URL_DEBOUNCE = 300

export const useUpdateViewStateUrlParams = () => {
  const viewState = useAtomValue(viewStateAtom)
  const isWorkspaceReady = useSelector(selectIsWorkspaceReady)
  const { replaceQueryParams } = useReplaceQueryParams()

  const debouncedReplace = useMemo(
    () =>
      debounce((viewport: WorkspaceViewport) => {
        replaceQueryParams(viewport)
      }, VIEW_STATE_URL_DEBOUNCE),
    [replaceQueryParams]
  )

  useEffect(() => {
    if (isWorkspaceReady) {
      const { longitude, latitude, zoom } = viewState
      debouncedReplace({ longitude, latitude, zoom })
    }
    return () => {
      debouncedReplace.cancel()
    }
  }, [viewState, isWorkspaceReady, debouncedReplace])
}

export const MAP_CONTAINER_ID = 'map-container'
export const MAP_VIEW_ID = 'mapViewport'
export const MAP_VIEW = new MapView({
  id: MAP_VIEW_ID,
  repeat: true,
  controller: true,
  bearing: 0,
  pitch: 0,
} as MapViewProps)

export function useMapViewport() {
  const deckMap = useDeckMap()
  try {
    return (deckMap as any)
      ?.getViewports?.()
      .find((v: any) => v.id === MAP_VIEW_ID) as WebMercatorViewport
  } catch {
    return undefined
  }
}
