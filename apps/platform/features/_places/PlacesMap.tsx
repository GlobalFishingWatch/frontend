import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Layer, PickingInfo } from '@deck.gl/core'
import { MapView, WebMercatorViewport } from '@deck.gl/core'
import DeckGL from '@deck.gl/react'
import { useNavigate } from '@tanstack/react-router'
import cx from 'classnames'
import { useAtomValue } from 'jotai'
import { useDebounce } from 'use-debounce'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { type DataviewInstance, DataviewType } from '@globalfishingwatch/api-types'
import type { ResolverGlobalConfig } from '@globalfishingwatch/deck-layer-composer'
import { useDeckLayerInstances } from '@globalfishingwatch/deck-layer-composer'
import type { ContextPickingObject } from '@globalfishingwatch/deck-layers'
import { BasemapType } from '@globalfishingwatch/deck-layers'
import type { OceanAreaBBox, OceanAreaType } from '@globalfishingwatch/ocean-areas'
import { IconButton } from '@globalfishingwatch/ui-components/icon-button'
import { SwitchRow } from '@globalfishingwatch/ui-components/switch-row'
import { DEFAULT_PLACES_VIEWPORT } from '@platform/config/map/app'

import BasemapSwitcher from 'features/_map/map/controls/BasemapSwitcher'
import { getContextValue } from 'features/_map/map/popups/map-popups.utils'
import { hoveredPlaceAtom } from 'features/_places/places.atoms'
import { getPlaceLinkOptions } from 'features/_places/places.links'
import { formatPlacesBounds, getPlaceLabel, parsePlacesBounds } from 'features/_places/places.utils'
import type { PlacesMapDataviews } from 'features/_places/places-map.config'
import { usePlacesMapDataviews } from 'features/_places/places-map.hooks'
import { useAppSearch, useReplaceQueryParams } from 'router/routes.hook'
import { htmlSafeParse } from 'utils/html-parser'

import styles from './PlacesMap.module.css'

const PLACES_MAP_VIEW = new MapView({ id: 'places-map', repeat: true })

const PLACES_MAP_CONTROLLER = {
  dragRotate: false,
  touchRotate: false,
  keyboard: { rotateSpeedX: 0, rotateSpeedY: 0 },
}

const USER_LOCATION_MIN_ZOOM = 8

type ViewState = typeof DEFAULT_PLACES_VIEWPORT

type Size = { width: number; height: number }

const getBounds = (viewState: ViewState, size: Size) =>
  new WebMercatorViewport({ ...viewState, ...size }).getBounds() as OceanAreaBBox

type HoverTooltip = { x: number; y: number; label: string }

type HighlightableLayer = Layer & {
  setHighlightedFeatures?: (features: ContextPickingObject[]) => void
}

const getRootLayer = (layer?: Layer | null) => {
  let root = layer
  while (root?.parent) root = root.parent
  return root as HighlightableLayer | undefined
}

const getHoverLabel = (type: OceanAreaType, object?: ContextPickingObject) => {
  if (!object) return undefined
  const { name, flag, NAME } = object.properties ?? {}
  if (name && flag) return getPlaceLabel({ name, flag, type })
  if (type === 'mpa' && NAME) return NAME as string
  return getContextValue(object) || undefined
}

type PlacesMapProps = {
  dataviewsByType: PlacesMapDataviews
  type: OceanAreaType
}

function PlacesMap({ dataviewsByType, type }: PlacesMapProps) {
  const { t } = useTranslation()
  const search = useAppSearch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const navigate = useNavigate()
  const basemap = search.basemap ?? BasemapType.Default
  const filterByMap = !!search.filterByMap
  const initialBounds = parsePlacesBounds(search.bounds)
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_PLACES_VIEWPORT)
  const [size, setSize] = useState<Size>()
  const userMovedRef = useRef(false)
  const [isLocating, setIsLocating] = useState(false)
  const [hoverTooltip, setHoverTooltip] = useState<HoverTooltip>()
  const highlightedRef = useRef<{ layer?: HighlightableLayer; id?: string | number }>({})
  const resolvedDataviews = usePlacesMapDataviews(dataviewsByType, type)
  const dataviews = useMemo(
    () =>
      resolvedDataviews.map((dataview) =>
        dataview.config?.type === DataviewType.Basemap
          ? { ...dataview, config: { ...dataview.config, basemap } }
          : dataview
      ),
    [resolvedDataviews, basemap]
  )
  const layers = useDeckLayerInstances({
    dataviews: dataviews as DataviewInstance[],
    globalConfig: { token: GFWAPI.token } as ResolverGlobalConfig,
  })

  const hoveredPlace = useAtomValue(hoveredPlaceAtom)
  useEffect(() => {
    if (!hoveredPlace) return
    const layer = (layers as HighlightableLayer[]).find((l) => l.setHighlightedFeatures)
    const { id, coordinates } = hoveredPlace
    layer?.setHighlightedFeatures?.([
      {
        id,
        ...(coordinates && { geometry: { type: 'Point', coordinates } }),
      } as unknown as ContextPickingObject,
    ])
    return () => layer?.setHighlightedFeatures?.([])
  }, [hoveredPlace, layers])

  const [settledViewState] = useDebounce(viewState, 500)
  useEffect(() => {
    if (userMovedRef.current && size) {
      replaceQueryParams({ bounds: formatPlacesBounds(getBounds(settledViewState, size)) })
    }
  }, [settledViewState, size, replaceQueryParams])

  const onResize = (newSize: Size) => {
    setSize(newSize)
    if (initialBounds && !userMovedRef.current && newSize.width && newSize.height) {
      const [west, south, east, north] = initialBounds
      const { longitude, latitude, zoom } = new WebMercatorViewport(newSize).fitBounds([
        [west, south],
        [east, north],
      ])
      setViewState({ longitude, latitude, zoom })
    }
  }

  const onHover = ({ x, y, object, layer }: PickingInfo<ContextPickingObject>) => {
    const label = getHoverLabel(type, object)
    setHoverTooltip(label ? { x, y, label } : undefined)

    const highlighted = object?.geometry ? object : undefined
    const rootLayer = highlighted ? getRootLayer(layer) : undefined
    const previous = highlightedRef.current
    if (previous.layer === rootLayer && previous.id === highlighted?.id) return
    if (previous.layer && previous.layer !== rootLayer) previous.layer.setHighlightedFeatures?.([])
    rootLayer?.setHighlightedFeatures?.(highlighted ? [highlighted] : [])
    highlightedRef.current = { layer: rootLayer, id: highlighted?.id }
  }

  const onClick = ({ object }: PickingInfo<ContextPickingObject>) => {
    if (object?.id === undefined) return
    const { name, flag } = object.properties ?? {}
    navigate(getPlaceLinkOptions({ id: object.id, name, flag, type }))
  }

  const canLocate = typeof navigator !== 'undefined' && 'geolocation' in navigator
  const onLocateClick = () => {
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        userMovedRef.current = true
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

  const opensLeft = !!size && !!hoverTooltip && hoverTooltip.x > size.width / 2

  return (
    <Fragment>
      <DeckGL
        views={PLACES_MAP_VIEW}
        viewState={viewState}
        onViewStateChange={({ viewState, interactionState }) => {
          const isUserMove =
            interactionState.isDragging ||
            interactionState.isPanning ||
            interactionState.isZooming ||
            interactionState.inTransition
          if (!isUserMove) return
          userMovedRef.current = true
          setViewState(viewState as ViewState)
        }}
        onResize={onResize}
        controller={PLACES_MAP_CONTROLLER}
        layers={layers}
        onHover={onHover}
        onClick={onClick}
        getCursor={({ isDragging }) =>
          isDragging ? 'grabbing' : hoverTooltip ? 'pointer' : 'grab'
        }
      />
      {hoverTooltip && (
        <div
          className={cx(styles.mapTooltip, { [styles.mapTooltipLeft]: opensLeft })}
          style={
            opensLeft
              ? { right: size.width - hoverTooltip.x, top: hoverTooltip.y }
              : { left: hoverTooltip.x, top: hoverTooltip.y }
          }
        >
          {htmlSafeParse(hoverTooltip.label)}
        </div>
      )}
      <div className={styles.mapControls}>
        {/* Bounds land in the URL once the user moves the map, so the filter is offered only then */}
        {search.bounds && (
          <SwitchRow
            className={styles.mapToggle}
            label={
              type === 'port' ? t((t) => t.places.filterByMapPorts) : t((t) => t.places.filterByMap)
            }
            active={filterByMap}
            inverted
            onClick={() =>
              size &&
              replaceQueryParams({
                filterByMap: !filterByMap || undefined,
                bounds: formatPlacesBounds(getBounds(viewState, size)),
              })
            }
          />
        )}
        {canLocate && (
          <IconButton
            icon="target"
            type="map-tool"
            loading={isLocating}
            tooltip={t((t) => t.places.centerOnMyLocation)}
            onClick={onLocateClick}
          />
        )}
        <BasemapSwitcher
          basemap={basemap}
          onChange={(basemap) => replaceQueryParams({ basemap })}
        />
      </div>
    </Fragment>
  )
}

export default PlacesMap
