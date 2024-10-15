import { Fragment, useCallback, useRef, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  MiniGlobe,
  IconButton,
  Tooltip,
  Modal,
  Spinner,
  Button,
} from '@globalfishingwatch/ui-components'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { DataviewType } from '@globalfishingwatch/api-types'
import { BasemapType } from '@globalfishingwatch/deck-layers'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useSetMapCoordinates, useMapViewState } from 'features/map/map-viewport.hooks'
import {
  selectIsAnyVesselLocation,
  selectIsAnyReportLocation,
  selectIsWorkspaceLocation,
  selectIsMapDrawing,
} from 'routes/routes.selectors'
import { useDownloadDomElementAsImage } from 'hooks/screen.hooks'
import { setInlineStyles, cleantInlineStyles } from 'utils/dom'
import { selectScreenshotModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { useMapBounds } from 'features/map/map-bounds.hooks'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import { useMapErrorNotification } from 'features/map/overlays/error-notification/error-notification.hooks'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { useRootElement } from 'hooks/dom.hooks'
import { isPrintSupported, MAP_IMAGE_DEBOUNCE } from '../MapScreenshot'
import styles from './MapControls.module.css'

const MiniGlobeInfo = dynamic(
  () => import(/* webpackChunkName: "MiniGlobeInfo" */ './MiniGlobeInfo')
)
const MapScreenshot = dynamic(
  () => import(/* webpackChunkName: "MapScreenshot" */ '../MapScreenshot')
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
  const dispatch = useAppDispatch()
  const modalOpen = useSelector(selectScreenshotModalOpen)
  const [miniGlobeHovered, setMiniGlobeHovered] = useState(false)
  const resolvedDataviewInstances = useSelector(selectDataviewInstancesResolved)
  const gfwUser = useSelector(selectIsGFWUser)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { dispatchQueryParams } = useLocationConnect()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const isVesselLocation = useSelector(selectIsAnyVesselLocation)
  const reportLocation = useSelector(selectIsAnyReportLocation)
  const isMapDrawing = useSelector(selectIsMapDrawing)
  const { isErrorNotificationEditing, toggleErrorNotification } = useMapErrorNotification()
  const showExtendedControls =
    (isWorkspaceLocation || isVesselLocation || reportLocation) && !isMapDrawing
  const showScreenshot = !isVesselLocation && !reportLocation
  const rootElement = useRootElement()

  const {
    loading,
    previewImage,
    downloadImage,
    resetPreviewImage,
    previewImageLoading,
    generatePreviewImage,
  } = useDownloadDomElementAsImage(rootElement, false)

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

  const onScreenshotClick = useCallback(() => {
    dispatchQueryParams({ sidebarOpen: true })
    dispatch(setModalOpen({ id: 'screenshot', open: true }))
    resetPreviewImage()
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      if (rootElement) {
        rootElement.classList.add('printing')
        setInlineStyles(rootElement)
        // leave some time to
        // 1. apply the styles + timebar to re - render
        // 2. map static image generated with debounced finishes
        timeoutRef.current = setTimeout(() => {
          generatePreviewImage()
        }, MAP_IMAGE_DEBOUNCE + 400)
      }
    }, 100)
  }, [dispatchQueryParams, dispatch, resetPreviewImage, rootElement, generatePreviewImage])

  const handleModalClose = useCallback(() => {
    if (rootElement) {
      rootElement.classList.remove('printing')
      cleantInlineStyles(rootElement)
    }
    dispatch(setModalOpen({ id: 'screenshot', open: false }))
  }, [dispatch, rootElement])

  const onPDFDownloadClick = useCallback(() => {
    handleModalClose()
    setTimeout(window.print, 200)
  }, [handleModalClose])

  const onImageDownloadClick = useCallback(async () => {
    await downloadImage()
    handleModalClose()
  }, [downloadImage, handleModalClose])

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
      {modalOpen && <MapScreenshot />}
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
                  disabled={mapLoading || loading}
                  tooltip={t('map.errorAction', 'Log an issue at a specific location')}
                  onClick={toggleErrorNotification}
                  className={cx({ [styles.active]: isErrorNotificationEditing })}
                />
              )}
              {showScreenshot && (
                <IconButton
                  icon="camera"
                  type="map-tool"
                  loading={loading}
                  disabled={mapLoading || loading}
                  tooltip={
                    mapLoading || loading
                      ? t('map.mapLoadingWait', 'Please wait until map loads')
                      : t('map.captureMap', 'Capture map')
                  }
                  onClick={onScreenshotClick}
                />
              )}
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
      <Modal
        appSelector={ROOT_DOM_ELEMENT}
        title="Screenshot preview"
        isOpen={modalOpen}
        onClose={handleModalClose}
        contentClassName={styles.previewContainer}
      >
        <div className={styles.previewPlaceholder}>
          {previewImageLoading || !previewImage ? (
            <Spinner />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={styles.previewImage} src={previewImage} alt="screenshot preview" />
          )}
        </div>
        <div className={styles.previewFooter}>
          <Button id="dismiss-preview-download" onClick={handleModalClose} type="secondary">
            Dismiss
          </Button>
          <div>
            {isPrintSupported && (
              <Button
                id="pdf-preview-download"
                onClick={onPDFDownloadClick}
                className={styles.printBtn}
              >
                Print PDF
              </Button>
            )}
            <Button id="image-preview-download" loading={loading} onClick={onImageDownloadClick}>
              Download image
            </Button>
          </div>
        </div>
      </Modal>
    </Fragment>
  )
}

export default MapControls
