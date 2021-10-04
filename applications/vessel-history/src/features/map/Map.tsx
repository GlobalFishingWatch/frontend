import React, { useCallback, useMemo, useRef } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { InteractiveMap } from 'react-map-gl'
import { useLayerComposer, useMapClick } from '@globalfishingwatch/react-hooks'
import { ExtendedStyleMeta } from '@globalfishingwatch/layer-composer'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { selectActiveVesselsDataviews } from 'features/dataviews/dataviews.selectors'
import { selectVesselById } from 'features/vessels/vessels.slice'
import Info from 'features/map/info/Info'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { DEFAULT_VESSEL_MAP_ZOOM, ENABLE_FLYTO, FLY_EFFECTS } from 'data/config'
import { selectVesselProfileId } from 'routes/routes.selectors'
import useVoyagesConnect from 'features/vessels/voyages/voyages.hook'
import { EventTypeVoyage } from 'types/voyage'
import { useGeneratorsConnect } from './map.hooks'
import useMapInstance from './map-context.hooks'
import useViewport from './map-viewport.hooks'
import MapControls from './controls/MapControls'
import useMapEvents from './map-events.hooks'
import { selectHighlightedEvent } from './map.slice'
import styles from './Map.module.css'
import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

const mapOptions: any = {
  customAttribution: '© Copyright Global Fishing Watch 2020',
}

const Map: React.FC = (): React.ReactElement => {
  const map = useMapInstance()
  const mapRef = useRef<any>(null)
  const highlightedEvent = useSelector(selectHighlightedEvent)
  const { selectVesselEventOnClick, highlightEvent } = useMapEvents()
  const { generatorsConfig, globalConfig, styleTransformations } = useGeneratorsConnect()
  const { viewport, onViewportChange, setMapCoordinates } = useViewport()
  const resourcesLoading = useSelector(selectResourcesLoading) ?? false
  const { style, loading: layerComposerLoading } = useLayerComposer(
    generatorsConfig,
    globalConfig,
    styleTransformations
  )
  const { eventsLoading, events } = useVoyagesConnect()

  const onMapClick = useMapClick(
    selectVesselEventOnClick,
    style?.metadata as ExtendedStyleMeta,
    map
  )

  const vesselProfileId = useSelector(selectVesselProfileId, shallowEqual)
  const vessel = useSelector(selectVesselById(vesselProfileId), shallowEqual)
  const [vesselDataview] = useSelector(selectActiveVesselsDataviews, shallowEqual) ?? []
  const vesselLoaded = useMemo(() => !!vessel, [vessel])
  const vesselDataviewLoaded = useMemo(() => !!vesselDataview, [vesselDataview])

  const onMapLoad = useCallback(() => {
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
    vesselLoaded,
    vesselDataviewLoaded,
    eventsLoading,
    highlightedEvent,
    events,
    highlightEvent,
    setMapCoordinates,
    viewport.zoom,
  ])

  if (ENABLE_FLYTO) {
    let flying = false
    let centetingMap: ReturnType<typeof setTimeout>
    mapRef?.current?.getMap().on('moveend', (e: any) => {
      if (flying) {
        if (centetingMap) {
          clearTimeout(centetingMap)
        }
        const currentPitch = mapRef?.current?.getMap().getPitch()
        const currentBearing = mapRef?.current?.getMap().getBearing()
        centetingMap = setTimeout(() => {
          mapRef?.current?.getMap().easeTo({
            center: [
              mapRef.current?.getMap().getCenter().lng,
              mapRef.current?.getMap().getCenter().lat,
            ],
            zoom: mapRef.current.getMap().getZoom() + 1,
            duration:
              1000 +
              (ENABLE_FLYTO === FLY_EFFECTS.fly ? currentPitch * 10 + currentBearing * 10 : -500),
            pitch: 0,
            bearing: 0,
          })
          setTimeout(() => {
            setMapCoordinates({
              latitude: mapRef.current?.getMap().getCenter().lat,
              longitude: mapRef.current?.getMap().getCenter().lng,
              zoom: mapRef.current.getMap().getZoom(),

              pitch: 0,
              bearing: 0,
            })
          }, 1002 + (ENABLE_FLYTO === FLY_EFFECTS.fly ? currentPitch * 10 + currentBearing * 10 : -500))
        }, 1)
        mapRef?.current?.getMap().fire('flyend')
      }
    })
    mapRef?.current?.getMap().on('flystart', function () {
      flying = true
    })
    mapRef?.current?.getMap().on('flyend', function () {
      flying = false
    })
  }

  const onEventChange = useCallback(
    (nextEvent: RenderedEvent, pitch: number, bearing: number, padding: number) => {
      const currentZoom = mapRef.current.getMap().getZoom() - 1
      if (ENABLE_FLYTO) {
        mapRef.current.getMap().flyTo({
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
        mapRef?.current?.getMap().fire('flystart')
        //dispatchQueryParams({ latitude: nextEvent.position.lat, longitude: nextEvent.position.lon })
      } else {
        //with this change we will center the event in the available map on the screen
        const coordinates = mapRef.current
          .getMap()
          .project([nextEvent.position.lon, nextEvent.position.lat])
        const offsetCoordinates = mapRef.current
          .getMap()
          .unproject([coordinates.x, coordinates.y + padding / 2])
        setMapCoordinates({
          latitude: offsetCoordinates.lat,
          longitude: offsetCoordinates.lng,
          zoom: currentZoom,
          pitch: 0,
          bearing: 0,
        })
      }
    },
    [setMapCoordinates]
  )

  return (
    <div className={styles.container}>
      {style && (
        <InteractiveMap
          disableTokenWarning={true}
          ref={mapRef}
          width="100%"
          height="100%"
          zoom={viewport.zoom}
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          onViewportChange={onViewportChange}
          onClick={onMapClick}
          onLoad={onMapLoad}
          mapStyle={style}
          mapOptions={mapOptions}
        ></InteractiveMap>
      )}
      <MapControls mapLoading={layerComposerLoading || resourcesLoading}></MapControls>
      <Info onEventChange={onEventChange}></Info>
    </div>
  )
}

export default Map
