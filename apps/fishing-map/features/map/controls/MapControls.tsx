import { Fragment, useCallback, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { MiniGlobe, IconButton, Tooltip } from '@globalfishingwatch/ui-components'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { DataviewType } from '@globalfishingwatch/api-types'
import { BasemapType } from '@globalfishingwatch/deck-layers'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useSetMapCoordinates, useMapViewState } from 'features/map/map-viewport.hooks'
import {
  selectIsAnyVesselLocation,
  selectIsWorkspaceLocation,
  selectIsMapDrawing,
  selectIsAnyReportLocation,
} from 'routes/routes.selectors'
import { useMapBounds } from 'features/map/map-bounds.hooks'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import { useMapErrorNotification } from 'features/map/overlays/error-notification/error-notification.hooks'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import styles from './MapControls.module.css'

const MiniGlobeInfo = dynamic(
  () => import(/* webpackChunkName: "MiniGlobeInfo" */ './MiniGlobeInfo')
)
const MapControlScreenshot = dynamic(
  () => import(/* webpackChunkName: "MapControlScreenshot" */ './MapControlScreenshot')
)
const MapSearch = dynamic(() => import(/* webpackChunkName: "MapSearch" */ './MapSearch'))
const Rulers = dynamic(
  () => import(/* webpackChunkName: "Rulers" */ 'features/map/controls/RulersControl')
)
const MapAnnotations = dynamic(
  () =>
    import(/* webpackChunkName: "AnnotationsControl" */ 'features/map/controls/AnnotationsControl')
)

const MapControls = ({
  mapLoading = false,
  onMouseEnter,
}: {
  mapLoading?: boolean
  onMouseEnter?: () => void
}): React.ReactElement => {
  const { t } = useTranslation()
  const [miniGlobeHovered, setMiniGlobeHovered] = useState(false)
  const resolvedDataviewInstances = useSelector(selectDataviewInstancesResolved)
  const gfwUser = useSelector(selectIsGFWUser)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const isAnyReportLocation = useSelector(selectIsAnyReportLocation)
  const isVesselLocation = useSelector(selectIsAnyVesselLocation)
  const isMapDrawing = useSelector(selectIsMapDrawing)
  const { isErrorNotificationEditing, toggleErrorNotification } = useMapErrorNotification()
  const showExtendedControls =
    (isWorkspaceLocation || isVesselLocation || isAnyReportLocation) && !isMapDrawing

  const setMapCoordinates = useSetMapCoordinates()
  const viewState = useMapViewState()
  const { latitude, longitude, zoom } = viewState

  const { bounds } = useMapBounds()

  const center = useMemo(
    () => ({
      latitude,
      longitude,
    }),
    [latitude, longitude]
  )
  const options = useMemo(() => ({ bounds, center }), [bounds, center])
  const debouncedOptions = useDebounce(options, 60)

  const onZoomInClick = useCallback(() => {
    setMapCoordinates({ zoom: zoom + 1 })
  }, [setMapCoordinates, zoom])

  const onZoomOutClick = useCallback(() => {
    setMapCoordinates({ zoom: Math.max(zoom - 1, 0) })
  }, [setMapCoordinates, zoom])

  const basemapDataviewInstance = resolvedDataviewInstances?.find(
    (d) => d.config?.type === DataviewType.Basemap
  )
  const currentBasemap = basemapDataviewInstance?.config?.basemap ?? BasemapType.Default
  const switchBasemap = () => {
    upsertDataviewInstance({
      id: basemapDataviewInstance?.id,
      config: {
        basemap:
          currentBasemap === BasemapType.Default ? BasemapType.Satellite : BasemapType.Default,
      },
    })
  }

  return (
    <Fragment>
      <div className={styles.mapControls} onMouseEnter={onMouseEnter}>
        <div
          onMouseEnter={() => setMiniGlobeHovered(true)}
          onMouseLeave={() => setMiniGlobeHovered(false)}
        >
          <MiniGlobe
            className={styles.miniglobe}
            size={60}
            viewportThickness={3}
            bounds={debouncedOptions.bounds}
            center={debouncedOptions.center}
          />
          {miniGlobeHovered && <MiniGlobeInfo viewport={viewState} />}
        </div>
        <div className={cx('print-hidden', styles.controlsNested)}>
          {(isWorkspaceLocation || isVesselLocation) && !isMapDrawing && <MapSearch />}
          <IconButton
            icon="plus"
            type="map-tool"
            tooltip={t('map.zoom_in', 'Zoom in')}
            onClick={onZoomInClick}
          />
          <IconButton
            icon="minus"
            type="map-tool"
            tooltip={t('map.zoom_out', 'Zoom out')}
            onClick={onZoomOutClick}
          />
          {showExtendedControls && (
            <Fragment>
              <Rulers />
              <MapAnnotations />
              {gfwUser && (
                <IconButton
                  icon="feedback-error"
                  type="map-tool"
                  disabled={mapLoading}
                  tooltip={t('map.errorAction', 'Log an issue at a specific location')}
                  onClick={toggleErrorNotification}
                  className={cx({ [styles.active]: isErrorNotificationEditing })}
                />
              )}
              <MapControlScreenshot />
              <Tooltip
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
              </Tooltip>
            </Fragment>
          )}
          <IconButton
            type="map-tool"
            tooltip={t('map.loading', 'Loading')}
            loading={mapLoading}
            className={cx(styles.loadingBtn, { [styles.visible]: mapLoading })}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default MapControls
