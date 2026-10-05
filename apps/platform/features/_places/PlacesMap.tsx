import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Layer, PickingInfo } from '@deck.gl/core'
import { MapView, WebMercatorViewport } from '@deck.gl/core'
import DeckGL from '@deck.gl/react'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { DataviewInstance } from '@globalfishingwatch/api-types'
import type { ResolverGlobalConfig } from '@globalfishingwatch/deck-layer-composer'
import { useDeckLayerInstances } from '@globalfishingwatch/deck-layer-composer'
import type { ContextPickingObject } from '@globalfishingwatch/deck-layers'
import type { OceanAreaBBox, OceanAreaType } from '@globalfishingwatch/ocean-areas'
import { IconButton } from '@globalfishingwatch/ui-components/icon-button'
import { SwitchRow } from '@globalfishingwatch/ui-components/switch-row'
import { DEFAULT_VIEWPORT } from '@platform/config/map/app'

import { getContextValue } from 'features/_map/map/popups/map-popups.utils'
import type { PlacesMapDataviews } from 'features/_places/places-map.config'
import { usePlacesMapDataviews } from 'features/_places/places-map.hooks'
import { htmlSafeParse } from 'utils/html-parser'
import { formatInfoField } from 'utils/info'

import styles from './places.module.css'

const PLACES_MAP_VIEW = new MapView({ id: 'places-map', repeat: true })

const USER_LOCATION_MIN_ZOOM = 8

type ViewState = typeof DEFAULT_VIEWPORT

type HoverTooltip = { x: number; y: number; label: string }

type HighlightableLayer = Layer & {
  setHighlightedFeatures?: (features: ContextPickingObject[]) => void
}

const getRootLayer = (layer?: Layer | null) => {
  let root = layer
  while (root?.parent) root = root.parent
  return root as HighlightableLayer | undefined
}

const getHoverLabel = (object?: ContextPickingObject): string | undefined => {
  if (!object) return undefined
  const { name, flag } = object.properties ?? {}
  if (name && flag) {
    return `${formatInfoField(name, 'port')} (${formatInfoField(flag, 'flag')})`
  }
  return getContextValue(object) || undefined
}

type PlacesMapProps = {
  dataviewsByType: PlacesMapDataviews
  type: OceanAreaType
  filterByMap: boolean
  onFilterByMapChange: (filterByMap: boolean) => void
  onBoundsChange: (bounds: OceanAreaBBox) => void
}

function PlacesMap({
  dataviewsByType,
  type,
  filterByMap,
  onFilterByMapChange,
  onBoundsChange,
}: PlacesMapProps) {
  const { t } = useTranslation()
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEWPORT)
  const [size, setSize] = useState<{ width: number; height: number }>()
  const [isLocating, setIsLocating] = useState(false)
  const [hoverTooltip, setHoverTooltip] = useState<HoverTooltip>()
  const highlightedRef = useRef<{ layer?: HighlightableLayer; id?: string | number }>({})
  const dataviews = usePlacesMapDataviews(dataviewsByType, type)
  const layers = useDeckLayerInstances({
    dataviews: dataviews as DataviewInstance[],
    globalConfig: { token: GFWAPI.token } as ResolverGlobalConfig,
  })

  useEffect(() => {
    if (!size?.width || !size.height) return
    const viewport = new WebMercatorViewport({ ...viewState, ...size })
    onBoundsChange(viewport.getBounds() as OceanAreaBBox)
  }, [viewState, size, onBoundsChange])

  const onHover = ({ x, y, object, layer }: PickingInfo<ContextPickingObject>) => {
    const label = getHoverLabel(object)
    setHoverTooltip(label ? { x, y, label } : undefined)

    const rootLayer = object ? getRootLayer(layer) : undefined
    const previous = highlightedRef.current
    if (previous.layer === rootLayer && previous.id === object?.id) return
    if (previous.layer && previous.layer !== rootLayer) previous.layer.setHighlightedFeatures?.([])
    rootLayer?.setHighlightedFeatures?.(object ? [object] : [])
    highlightedRef.current = { layer: rootLayer, id: object?.id }
  }

  const canLocate = typeof navigator !== 'undefined' && 'geolocation' in navigator
  const onLocateClick = () => {
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setViewState((current) => ({
          ...current,
          longitude: coords.longitude,
          latitude: coords.latitude,
          zoom: Math.max(current.zoom, USER_LOCATION_MIN_ZOOM),
        }))
        setIsLocating(false)
      },
      (error) => {
        console.warn('Places map: could not get user location', error.message)
        setIsLocating(false)
      }
    )
  }

  return (
    <>
      <DeckGL
        views={PLACES_MAP_VIEW}
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState as ViewState)}
        onResize={setSize}
        controller
        layers={layers}
        onHover={onHover}
        getCursor={({ isDragging }) =>
          isDragging ? 'grabbing' : hoverTooltip ? 'pointer' : 'grab'
        }
      />
      {hoverTooltip && (
        <div className={styles.mapTooltip} style={{ left: hoverTooltip.x, top: hoverTooltip.y }}>
          {htmlSafeParse(hoverTooltip.label)}
        </div>
      )}
      <div className={styles.mapControls}>
        <SwitchRow
          className={styles.mapToggle}
          label={t((t) => t.places.filterByMap)}
          active={filterByMap}
          onClick={() => onFilterByMapChange(!filterByMap)}
        />
        {canLocate && (
          <IconButton
            icon="target"
            type="map-tool"
            loading={isLocating}
            tooltip={t((t) => t.places.centerOnMyLocation)}
            onClick={onLocateClick}
          />
        )}
      </div>
    </>
  )
}

export default PlacesMap
