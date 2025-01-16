import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MapboxStyle } from 'react-map-gl';
import { Map } from 'react-map-gl'
import { useSelector } from 'react-redux'

import { DatasetCategory, DatasetSubCategory } from '@globalfishingwatch/api-types'
import type { ExtendedStyleMeta} from '@globalfishingwatch/layer-composer';
import { GeneratorType,useLayerComposer, useMapClick  } from '@globalfishingwatch/layer-composer'
import maplibregl from '@globalfishingwatch/maplibre-gl'
import { useMemoCompare } from '@globalfishingwatch/react-hooks'

import { DEFAULT_VESSEL_MAP_ZOOM, ENABLE_FLYTO, FLY_EFFECTS } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectActiveVesselsDataviews,
  selectDataviewInstancesByType,
} from 'features/dataviews/dataviews.selectors'
import { selectFilters } from 'features/event-filters/filters.slice'
import Info from 'features/map/info/Info'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import type { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { selectVesselById } from 'features/vessels/vessels.slice'
import { parseVesselProfileId } from 'features/vessels/vessels.utils'
import useVoyagesConnect from 'features/vessels/voyages/voyages.hook'
import { selectMergedVesselId } from 'routes/routes.selectors'
import { EventTypeVoyage } from 'types/voyage'
import { getUTCDateTime } from 'utils/dates'

import MapControls from './controls/MapControls'
import PopupWrapper from './popups/PopupWrapper'
import { useGeneratorsConnect } from './map.hooks'
import { selectHighlightedEvent, selectMapVoyageTime } from './map.slice'
import useMapInstance from './map-context.hooks'
import useMapEvents from './map-events.hooks'
import useViewport from './map-viewport.hooks'

import styles from './Map.module.css'

const mapStyles = {
  width: '100%',
  height: '100%',
}

const MapWrapper: React.FC = (): React.ReactElement<any> => {
  const map = useMapInstance()
  const dispatch = useAppDispatch()
  const flying = useRef(false)
  const highlightedEvent = useSelector(selectHighlightedEvent)
  const { clickedLayers, selectVesselEventOnClick, highlightEvent, onFiltersChanged } =
    useMapEvents()
  const { generatorsConfig, globalConfig, styleTransformations } = useGeneratorsConnect()
  const { viewport, onViewportChange, setMapCoordinates } = useViewport()
  const resourcesLoading: boolean = useSelector(selectResourcesLoading) ?? false
  const { style, loading: layerComposerLoading } = useLayerComposer(
    generatorsConfig,
    globalConfig,
    styleTransformations
  )
  const interactiveLayerIds = useMemoCompare(style?.metadata?.interactiveLayerIds)
  const { eventsLoading, events } = useVoyagesConnect()

  const [clickCoordinates, setClickCoordinates] = useState<{
    latitude?: number
    longitude?: number
  } | null>(null)
  const onMapClick: any = useMapClick(
    (event) => {
      setClickCoordinates({ latitude: event?.latitude, longitude: event?.longitude })
      selectVesselEventOnClick(event)
    },
    style?.metadata as ExtendedStyleMeta,
    map
  )

  const mergedVesselId = useSelector(selectMergedVesselId)
  const vessel = useSelector(selectVesselById(mergedVesselId))

  const [vesselDataview] = useSelector(selectActiveVesselsDataviews) ?? []
  const vesselLoaded = useMemo(() => !!vessel, [vessel])
  const vesselDataviewLoaded = useMemo(() => !!vesselDataview, [vesselDataview])
  const filters = useSelector(selectFilters)
  const [prevFilters, setPrevFilters] = useState(filters)
  const contextLayers = useSelector(selectDataviewInstancesByType(GeneratorType.Context))

  useEffect(() => {
    if (!vesselLoaded || !vesselDataviewLoaded || eventsLoading || highlightedEvent) return

    const lastEvent =
      (events.find((event) => event.type !== EventTypeVoyage.Voyage) as RenderedEvent) || undefined
    if (lastEvent) {
      highlightEvent(lastEvent)
      setMapCoordinates({
        latitude: lastEvent.position.lat,
        longitude: lastEvent.position.lon,
        zoom: viewport.zoom ?? DEFAULT_VESSEL_MAP_ZOOM,
        bearing: 0,
        pitch: 0,
      })
    }
  }, [
    dispatch,
    events,
    eventsLoading,
    highlightEvent,
    highlightedEvent,
    setMapCoordinates,
    vesselDataviewLoaded,
    vesselLoaded,
    viewport.zoom,
  ])

  // Highlight last event and voyage when filters change and
  // the previously highlighted event is not shown in the list anymore
  useEffect(() => {
    if (JSON.stringify(prevFilters) !== JSON.stringify(filters)) {
      onFiltersChanged()
      setPrevFilters(filters)
    }
  }, [filters, onFiltersChanged, prevFilters])

  useEffect(() => {
    if (ENABLE_FLYTO && map) {
      let centetingMap: ReturnType<typeof setTimeout>
      map.on('moveend', (e: any) => {
        if (flying.current) {
          flying.current = false
          if (centetingMap) {
            clearTimeout(centetingMap)
          }
          const currentPitch = map.getPitch()
          const currentBearing = map.getBearing()
          centetingMap = setTimeout(() => {
            map.easeTo({
              center: [map.getCenter().lng, map.getCenter().lat],
              zoom: ENABLE_FLYTO ? map.getZoom() + 1 : map.getZoom(),
              duration:
                1000 +
                (ENABLE_FLYTO === FLY_EFFECTS.fly ? currentPitch * 10 + currentBearing * 10 : -500),
              pitch: 0,
              bearing: 0,
            })
            setTimeout(() => {
              setMapCoordinates({
                latitude: map.getCenter().lat,
                longitude: map.getCenter().lng,
                zoom: map.getZoom(),

                pitch: 0,
                bearing: 0,
              })
            }, 1002 + (ENABLE_FLYTO === FLY_EFFECTS.fly ? currentPitch * 10 + currentBearing * 10 : -500))
          }, 1)
          map.fire('flyend')
        }
      })
    }
     
  }, [map])

  const onEventChange = useCallback(
    (nextEvent: RenderedEvent, pitch: number, bearing: number, padding: number) => {
      const currentZoom = ENABLE_FLYTO ? map.getZoom() - 1 : map.getZoom()
      if (ENABLE_FLYTO) {
        map.flyTo({
          center: [nextEvent.position.lon, nextEvent.position.lat],
          pitch: ENABLE_FLYTO === FLY_EFFECTS.fly ? pitch : 0,
          bearing: ENABLE_FLYTO === FLY_EFFECTS.fly ? bearing : 0,
          zoom: currentZoom,
          padding: {
            bottom: padding,
          },
          speed: currentZoom / 20, // make the flying slow
          curve: ENABLE_FLYTO === FLY_EFFECTS.fly ? 1.5 : 2.5, // change the speed at which it zooms out
          essential: true, // this animation is considered essential with respect to prefers-reduced-motion
        })
        flying.current = true
        //dispatchQueryParams({ latitude: nextEvent.position.lat, longitude: nextEvent.position.lon })
      } else {
        //with this change we will center the event in the available map on the screen
        const coordinates = map.project([nextEvent.position.lon, nextEvent.position.lat])
        const offsetCoordinates = map.unproject([coordinates.x, coordinates.y + padding / 2])
        highlightEvent(nextEvent)
        setMapCoordinates({
          latitude: offsetCoordinates.lat,
          longitude: offsetCoordinates.lng,
          zoom: currentZoom,
          pitch: 0,
          bearing: 0,
        })
      }
    },
    [highlightEvent, map, setMapCoordinates]
  )

  const currentVoyageTime = useSelector(selectMapVoyageTime)

  const viewInGFWMap = useCallback(() => {
    const start = currentVoyageTime
      ? `${currentVoyageTime.start.substring(0, 10)}T00%3A00%3A00.000Z`
      : ''
    const end = currentVoyageTime
      ? getUTCDateTime(`${currentVoyageTime.end.substring(0, 10)}`)
          .plus({ days: 1 })
          .toISO()
      : ''

    const [mainVessel, ...otherVessels] = vessel.id
      .split('|')
      .map((id) => parseVesselProfileId(id))
      .filter((x) => x.id)

    let i = 0
    let eventsCount = 0
    const datasets = Array.from(new Set(vesselDataview.datasets.map(({ id }) => id)))
      .map((id) => {
        const d = vesselDataview.datasets.find((d) => d.id === id)
        if (
          [DatasetSubCategory.Info, DatasetSubCategory.Track].includes(
            d.subcategory as DatasetSubCategory
          )
        )
          return `dvIn[${i}][cfg][${d.subcategory}]=${id}`

        if ([DatasetCategory.Event].includes(d.category))
          return `dvIn[${i}][cfg][events][${eventsCount++}]=${id}`
        return ''
      })
      .filter((x) => x)

    const fishingMapVesselDataview = [
      `dvIn[${i}][id]=vessel-${mainVessel.id}`,
      `dvIn[${i}][dvId]=fishing-map-vessel-track`,
      ...datasets,
      `dvIn[${i}][cfg][clr]=%23F95E5E`,
    ]
    if (otherVessels?.length) {
      otherVessels.forEach((vessel, index) => {
        fishingMapVesselDataview.push(`dvIn[${i}][cfg][relatedVesselIds][${index}]=${vessel.id}`)
      })
    }
    const contextLayersDataviews = contextLayers
      .filter((x) => x?.config?.visible)
      .map((layer) => {
        i++
        return [`dvIn[${i}][id]=${layer.id}`, `dvIn[${i}][cfg][vis]=true`]
      })
      .flat()

    const fishingEffortLayersHidden = [
      'fishing-ais',
      // Update this dataviewId when a the vms layer dataview id is changed in
      // https://github.com/GlobalFishingWatch/frontend/blob/develop/apps/fishing-map/features/workspace/highlight-panel/highlight-panel.content.ts#L43
      'vms-with-png',
    ]
      .map((layer) => {
        i++
        return [`dvIn[${i}][id]=${layer}`, `dvIn[${i}][cfg][vis]=false`]
      })
      .flat()

    const urlSegments = [
      `https://globalfishingwatch.org/map/index?`,
      `start=${start}`,
      `latitude=${viewport.latitude}`,
      `longitude=${viewport.longitude}`,
      `zoom=${viewport.zoom}`,
      `end=${end}`,
      ...fishingMapVesselDataview,
      ...contextLayersDataviews,
      ...fishingEffortLayersHidden,
      `timebarVisualisation=vessel`,
    ]
    const url = urlSegments.join('&')
    window.open(url)
  }, [
    currentVoyageTime,
    vessel,
    vesselDataview,
    viewport.latitude,
    viewport.longitude,
    viewport.zoom,
    contextLayers,
  ])

  return (
    <div className={styles.container}>
      {style && (
        <Map
          id="map"
          mapLib={maplibregl as any}
          style={mapStyles}
          zoom={viewport.zoom}
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          onMove={onViewportChange}
          onClick={onMapClick}
          mapStyle={style as MapboxStyle}
          interactiveLayerIds={interactiveLayerIds}
          customAttribution={'© Copyright Global Fishing Watch 2020'}
        >
          {clickedLayers && clickCoordinates && (
            <PopupWrapper
              key={Math.random()}
              layers={clickedLayers}
              latitude={clickCoordinates.latitude as number}
              longitude={clickCoordinates.longitude as number}
            />
          )}
        </Map>
      )}
      <MapControls
        mapLoading={layerComposerLoading || resourcesLoading}
        onViewInGFWMap={viewInGFWMap}
      ></MapControls>
      <Info onEventChange={onEventChange}></Info>
    </div>
  )
}

export default MapWrapper
