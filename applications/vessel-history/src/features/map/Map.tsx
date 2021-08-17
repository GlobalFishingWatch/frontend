import { ReactElement, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InteractiveMap } from '@globalfishingwatch/react-map-gl'
import { useLayerComposer, useMapClick } from '@globalfishingwatch/react-hooks'
import { ExtendedStyleMeta } from '@globalfishingwatch/layer-composer'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import Info from 'features/map/info/Info'
import { updateProfileParams, updateQueryParams, updateUrlViewport } from 'routes/routes.actions'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.slice'
import { useLocationConnect } from 'routes/routes.hook'
import { useGeneratorsConnect } from './map.hooks'
import useMapInstance from './map-context.hooks'
import useViewport from './map-viewport.hooks'
import MapControls from './controls/MapControls'
import useMapEvents from './map-events.hooks'
import styles from './Map.module.css'
import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

const Map = (): ReactElement => {
  const map = useMapInstance()
  const dispatch = useDispatch()
  const mapRef = useRef<any>(null)
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
  let flying = false
  let setMapCenter: ReturnType<typeof setTimeout>
  mapRef?.current?.getMap().on('moveend', (e: any) => {
    if(flying) {
      console.log('*****', e)
      console.log('*****', mapRef.current?.getMap().getCenter())
      
      
      if (setMapCenter){
        clearTimeout(setMapCenter)
      }
      setMapCenter = setTimeout(() => {
        setMapCoordinates({
          latitude: mapRef.current?.getMap().getCenter().lat,
          longitude: mapRef.current?.getMap().getCenter().lng,
          zoom: 8,
          pitch: 60
        })
        setTimeout(() => {
          console.log('////////////////////////////////////')
          mapRef?.current?.getMap().easeTo({
            center: [
              mapRef.current?.getMap().getCenter().lng,
              mapRef.current?.getMap().getCenter().lat
            ],
            duration: 2000,
            pitch: 0
          })
        }, 100)
      }, 100)
      mapRef?.current?.getMap().fire('flyend');
    }
  });
  mapRef?.current?.getMap().on('flystart', function(){
    flying = true;
  });
  mapRef?.current?.getMap().on('flyend', function(){
    flying = false;
  });

  const onEventChange = useCallback(
    (nextEvent: RenderedEvent) => {
      console.log(mapRef.current?.getMap())
      mapRef.current.getMap().flyTo({
        center: [
          nextEvent.position.lon,
          nextEvent.position.lat,
        ],
        pitch: 60,
        zoom: 8,
        speed: 0.4, // make the flying slow
        curve: 1, // change the speed at which it zooms out
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      })
      mapRef?.current?.getMap().fire('flystart')
      
      console.log(mapRef.current?.getMap().getCenter())
      console.log(nextEvent.position.lon,
        nextEvent.position.lat)
      dispatchQueryParams({'latitude': nextEvent.position.lat, 'longitude': nextEvent.position.lon})
    }, [dispatch])
  

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
          mapStyle={style}
          mapOptions={mapOptions}
          //transitionDuration={500}
        ></InteractiveMap>
      )}
      <MapControls mapLoading={layerComposerLoading || resourcesLoading}></MapControls>
      <Info map={mapRef} onEventChange={onEventChange}></Info>
    </div>
  )
}

export default Map
