import { Fragment, useCallback, useMemo } from 'react'
import cx from 'classnames'
import { MiniGlobe, IconButton } from '@globalfishingwatch/ui-components'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { useViewport } from 'features/map/map-viewport.hooks'
import { useMapBounds } from 'features/map/map-bounds.hooks'
import styles from './MapControls.module.css'

const MapControls = ({ mapLoading = false }: { mapLoading?: boolean }): React.ReactElement => {
  const { viewport, setMapCoordinates } = useViewport()
  const { latitude, longitude, zoom } = viewport
  const bounds = useMapBounds()
  const center = useMemo(
    () => ({
      latitude,
      longitude,
    }),
    [latitude, longitude]
  )
  const options = useMemo(() => ({ bounds, center }), [bounds, center])
  const debouncedOptions = useDebounce(options, 16)

  const onZoomInClick = useCallback(() => {
    setMapCoordinates({ latitude, longitude, zoom: zoom + 1 })
  }, [latitude, longitude, setMapCoordinates, zoom])

  const onZoomOutClick = useCallback(() => {
    setMapCoordinates({ latitude, longitude, zoom: Math.max(1, zoom - 1) })
  }, [latitude, longitude, setMapCoordinates, zoom])

  // const basemapDataviewInstance = resolvedDataviewInstances?.find(
  //   (d) => d.config?.type === GeneratorType.Basemap
  // )
  // const currentBasemap = basemapDataviewInstance?.config?.basemap ?? BasemapType.Default
  // const switchBasemap = () => {
  //   upsertDataviewInstance({
  //     id: basemapDataviewInstance?.id,
  //     config: {
  //       basemap:
  //         currentBasemap === BasemapType.Default ? BasemapType.Satellite : BasemapType.Default,
  //     },
  //   })
  // }

  return (
    <Fragment>
      <div className={styles.mapControls}>
        <MiniGlobe
          className={styles.miniglobe}
          size={60}
          viewportThickness={3}
          bounds={debouncedOptions.bounds}
          center={debouncedOptions.center}
        />
        <div className={cx('print-hidden', styles.controlsNested)}>
          <IconButton icon="plus" type="map-tool" tooltip="Zoom in" onClick={onZoomInClick} />
          <IconButton icon="minus" type="map-tool" tooltip="Zoom out" onClick={onZoomOutClick} />
          {/* <Tooltip
            content={
              currentBasemap === BasemapType.Default
                ? t('map.change_basemap_satellite', 'Switch to satellite basemap')
                : t('map.change_basemap_default', 'Switch to default basemap')
            }
            placement="left"
          >
            <button
              aria-label={
                currentBasemap === BasemapType.Default
                  ? t('map.change_basemap_satellite', 'Switch to satellite basemap')
                  : t('map.change_basemap_default', 'Switch to default basemap')
              }
              className={cx(styles.basemapSwitcher, styles[currentBasemap])}
              onClick={switchBasemap}
            ></button>
          </Tooltip> */}
          <IconButton
            type="map-tool"
            tooltip="Loading"
            loading={mapLoading}
            className={cx(styles.loadingBtn, { [styles.visible]: mapLoading })}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default MapControls
