import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Map, MapboxStyle } from 'react-map-gl'
import maplibregl from '@globalfishingwatch/maplibre-gl'
import { useLayerComposer, useMapClick, useMemoCompare } from '@globalfishingwatch/react-hooks'
import { ExtendedStyleMeta, GeneratorType } from '@globalfishingwatch/layer-composer'
import {
  BaseUrlWorkspace,
  stringifyWorkspace,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { selectActiveVesselsDataviews } from 'features/dataviews/dataviews.selectors'
import { selectVesselById } from 'features/vessels/vessels.slice'
import Info from 'features/map/info/Info'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { DEFAULT_VESSEL_MAP_ZOOM, DEFAULT_WORKSPACE, ENABLE_FLYTO, FLY_EFFECTS } from 'data/config'
import { selectAllGFWIds, selectMergedVesselId, selectUrlTimeRange } from 'routes/routes.selectors'
import useVoyagesConnect from 'features/vessels/voyages/voyages.hook'
import { EventTypeVoyage } from 'types/voyage'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectFilters } from 'features/event-filters/filters.slice'
import { useGeneratorsConnect } from './map.hooks'
import useMapInstance from './map-context.hooks'
import useViewport from './map-viewport.hooks'
import MapControls from './controls/MapControls'
import useMapEvents from './map-events.hooks'
import { selectHighlightedEvent } from './map.slice'
import styles from './Map.module.css'
import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { selectDatasets } from 'features/datasets/datasets.slice'
import {
  getRelatedDatasetByType,
  getRelatedDatasetsByType,
} from 'features/datasets/datasets.selectors'

const mapStyles = {
  width: '100%',
  height: '100%',
}

const MapWrapper: React.FC = (): React.ReactElement => {
  const map = useMapInstance()
  const dispatch = useAppDispatch()
  const flying = useRef(false)
  const highlightedEvent = useSelector(selectHighlightedEvent)
  const datasets = useSelector(selectDatasets)
  const allGFWIds = useSelector(selectAllGFWIds)
  const { selectVesselEventOnClick, highlightEvent, onFiltersChanged } = useMapEvents()
  const { generatorsConfig, globalConfig, styleTransformations } = useGeneratorsConnect()
  const { viewport, onViewportChange, setMapCoordinates } = useViewport()
  const resourcesLoading: boolean = useSelector(selectResourcesLoading) ?? false
  const { style, loading: layerComposerLoading } = useLayerComposer(
    generatorsConfig,
    globalConfig,
    styleTransformations
  )
  const openMainMap = useCallback(() => {
    // colors used in the map
    const colors = ['#f4511f', '#33b679', '#f09300', '#ffea00', '#9ca4ff']
    const presenceDataviews = [
      {
        id: 'fishing-ais',
        config: {
          visible: false,
        },
      },
      {
        id: 'vms',
        config: {
          visible: false,
        },
      },
    ]

    const instances: UrlDataviewInstance<GeneratorType>[] = allGFWIds.map((GFWId, index) => {
      const vesselDataset = decodeURIComponent(GFWId[0])
      const infoDataset = datasets.find((dataset) => dataset.id === vesselDataset)
      const trackDataset = getRelatedDatasetByType(infoDataset, DatasetTypes.Tracks)
      const eventsRelatedDatasets = getRelatedDatasetsByType(infoDataset, DatasetTypes.Events)

      const eventsDatasetsId =
        eventsRelatedDatasets && eventsRelatedDatasets?.length
          ? eventsRelatedDatasets.map((d) => d.id)
          : []

      if (infoDataset || trackDataset) {
        const vesselDataviewInstance = {
          ...getVesselDataviewInstance(
            { id: GFWId[1] },
            {
              trackDatasetId: trackDataset?.id,
              infoDatasetId: infoDataset?.id,

              ...(eventsDatasetsId.length > 0 && { eventsDatasetsId }),
            }
          ),
          ...{
            config: {
              color: colors[index],
            },
          },
        }
        return vesselDataviewInstance
      }
      return null
    })

    const urlJson: BaseUrlWorkspace = {
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: viewport.zoom,
      start: DEFAULT_WORKSPACE.availableStart,
      end: DEFAULT_WORKSPACE.availableEnd,
      dataviewInstances: [...presenceDataviews, ...instances],
    }

    const url = stringifyWorkspace(urlJson)
    window.open('https://fishing-map.dev.globalfishingwatch.org/map/?' + url, '_blank').focus()
  }, [datasets, allGFWIds])

  const interactiveLayerIds = useMemoCompare(style?.metadata?.interactiveLayerIds)
  const { eventsLoading, events } = useVoyagesConnect()

  const onMapClick: any = useMapClick(
    selectVesselEventOnClick,
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

  useEffect(() => {
    if (!vesselLoaded || !vesselDataviewLoaded || eventsLoading || highlightedEvent) return
    openMainMap()
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
    openMainMap,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setMapCoordinates({
          latitude: offsetCoordinates.lat,
          longitude: offsetCoordinates.lng,
          zoom: currentZoom,
          pitch: 0,
          bearing: 0,
        })
      }
    },
    [map, setMapCoordinates]
  )

  return (
    <div className={styles.container}>
      {style && (
        <Map
          id="map"
          mapLib={maplibregl}
          style={mapStyles}
          zoom={viewport.zoom}
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          onMove={onViewportChange}
          onClick={onMapClick}
          mapStyle={style as MapboxStyle}
          interactiveLayerIds={interactiveLayerIds}
          customAttribution={'© Copyright Global Fishing Watch 2020'}
        ></Map>
      )}
      <MapControls mapLoading={layerComposerLoading || resourcesLoading}></MapControls>
      <Info onEventChange={onEventChange}></Info>
    </div>
  )
}

export default MapWrapper
