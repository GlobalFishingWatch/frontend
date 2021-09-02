import { ReactElement, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InteractiveMap } from '@globalfishingwatch/react-map-gl'
import { useLayerComposer, useMapClick } from '@globalfishingwatch/react-hooks'
import { ExtendedStyleMeta } from '@globalfishingwatch/layer-composer'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import Info from 'features/map/info/Info'
import { useLocationConnect } from 'routes/routes.hook'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { ENABLE_FLYTO, FLY_EFFECTS } from 'data/config'
import { useGeneratorsConnect } from './map.hooks'
import useMapInstance from './map-context.hooks'
import useViewport from './map-viewport.hooks'
import MapControls from './controls/MapControls'
import useMapEvents from './map-events.hooks'
import styles from './Map.module.css'
import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'
import { selectUrlViewport } from 'routes/routes.selectors'

const Map = (): ReactElement => {
  const map = useMapInstance()
  const mapRef = useRef<any>(null)
  const dispatch = useDispatch()
  const { selectVesselEventOnClick } = useMapEvents()
  const { dispatchQueryParams } = useLocationConnect()
  const { generatorsConfig, globalConfig, styleTransformations } = useGeneratorsConnect()
  const { viewport, onViewportChange, setMapCoordinates } = useViewport()
  const resourcesLoading = useSelector(selectResourcesLoading) ?? false
  const { style, loading: layerComposerLoading } = useLayerComposer(
    generatorsConfig,
    globalConfig,
    styleTransformations
  )
  const mapOptions = {
    customAttribution: '© Copyright Global Fishing Watch 2020',
  }

  const onMapClick = useMapClick(
    selectVesselEventOnClick,
    style?.metadata as ExtendedStyleMeta,
    map
  )
  
  const url = useSelector(selectUrlViewport)

  const onMapResize = useCallback(() => {
    if (url && mapRef){
      const {latitude, longitude} = url
      if (mapRef.current?.getMap().getCenter().lat !== latitude) {
        // avoid to center in every resize (if happen)
        setMapCoordinates({
          latitude,
          longitude,
          bearing: 0,
          pitch: 0,
          zoom: 8
        })
      }
    }
    },[setMapCoordinates, url]
  )

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
          setMapCoordinates({
            latitude: mapRef.current?.getMap().getCenter().lat,
            longitude: mapRef.current?.getMap().getCenter().lng,
            zoom: mapRef.current.getMap().getZoom(),

            pitch: currentPitch,
            bearing: currentBearing,
          })
          setTimeout(() => {
            mapRef?.current?.getMap().easeTo({
              center: [
                mapRef.current?.getMap().getCenter().lng,
                mapRef.current?.getMap().getCenter().lat,
              ],
              zoom: mapRef.current.getMap().getZoom() + 1,
              duration:
                2000 +
                (ENABLE_FLYTO === FLY_EFFECTS.fly ? currentPitch * 10 + currentBearing * 10 : -500),
              pitch: 0,
              bearing: 0,
            })
          }, 50)
        }, 50)
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
        dispatchQueryParams({ latitude: nextEvent.position.lat, longitude: nextEvent.position.lon })
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
    [dispatchQueryParams, setMapCoordinates]
  )

  return (
    <div className={styles.container}>
      {style && (
        <InteractiveMap
          disableTokenWarning={true}
          ref={mapRef}
          width="100%"
          height="100%"
          {...viewport}
          onViewportChange={onViewportChange}
          onClick={onMapClick}
          onResize={onMapResize}
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
