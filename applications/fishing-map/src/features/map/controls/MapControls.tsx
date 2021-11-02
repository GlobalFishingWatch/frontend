import React, { Fragment, useCallback, useEffect, useRef, useState, useMemo } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import formatcoords from 'formatcoords'
import {
  MiniGlobe,
  IconButton,
  Tooltip,
  Modal,
  Spinner,
  Button,
} from '@globalfishingwatch/ui-components'
import { Generators } from '@globalfishingwatch/layer-composer'
import { getOceanAreaName, OceanAreaLocale } from '@globalfishingwatch/ocean-areas'
import useDebounce from '@globalfishingwatch/react-hooks/dist/use-debounce'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectDataviewInstancesResolved } from 'features/dataviews/dataviews.selectors'
import Rulers from 'features/map/rulers/Rulers'
import useViewport, { useMapBounds } from 'features/map/map-viewport.hooks'
import { isWorkspaceLocation } from 'routes/routes.selectors'
import { useDownloadDomElementAsImage } from 'hooks/screen.hooks'
import setInlineStyles from 'utils/dom'
import { MapCoordinates } from 'types'
import { toFixed } from 'utils/shared'
import { selectIsAnalyzing } from 'features/analysis/analysis.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { isPrintSupported, MAP_IMAGE_DEBOUNCE } from '../MapScreenshot'
import styles from './MapControls.module.css'
import MapSearch from './MapSearch'

const MiniGlobeInfo = ({ viewport }: { viewport: MapCoordinates }) => {
  const { i18n } = useTranslation()
  const [showDMS, setShowDMS] = useState(true)
  return (
    <div className={styles.miniGlobeInfo} onClick={() => setShowDMS(!showDMS)}>
      <div className={styles.miniGlobeInfoTitle}>
        {getOceanAreaName(viewport, {
          locale: i18n.language as OceanAreaLocale,
          combineWithEEZ: true,
        })}
      </div>
      <div>
        {showDMS
          ? formatcoords(viewport.latitude, viewport.longitude).format('DDMMssX', {
              latLonSeparator: '',
              decimalPlaces: 2,
            })
          : `${toFixed(viewport.latitude, 4)},${toFixed(viewport.longitude, 4)}`}
      </div>
    </div>
  )
}

const MapControls = ({
  mapLoading = false,
  onMouseEnter,
}: {
  mapLoading?: boolean
  onMouseEnter: () => void
}): React.ReactElement => {
  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)
  const [miniGlobeHovered, setMiniGlobeHovered] = useState(false)
  const resolvedDataviewInstances = useSelector(selectDataviewInstancesResolved)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { dispatchQueryParams } = useLocationConnect()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const domElement = useRef<HTMLElement>()
  const {
    loading,
    previewImage,
    downloadImage,
    resetPreviewImage,
    previewImageLoading,
    generatePreviewImage,
  } = useDownloadDomElementAsImage(domElement.current, false)

  useEffect(() => {
    if (!domElement.current) {
      domElement.current = document.getElementById('root') as HTMLElement
    }
  }, [])

  const { viewport, setMapCoordinates } = useViewport()
  const { latitude, longitude, zoom } = viewport
  const { bounds } = useMapBounds()
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

  const onScreenshotClick = useCallback(() => {
    dispatchQueryParams({ sidebarOpen: true })
    setModalOpen(true)
    resetPreviewImage()
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      if (domElement.current) {
        domElement.current.classList.add('printing')
        setInlineStyles(domElement.current)
        // leave some time to
        // 1. apply the styles + timebar to re - render
        // 2. map static image generated with debounced finishes
        timeoutRef.current = setTimeout(() => {
          generatePreviewImage()
        }, MAP_IMAGE_DEBOUNCE + 400)
      }
    }, 100)
  }, [dispatchQueryParams, resetPreviewImage, generatePreviewImage])

  const handleModalClose = useCallback(() => {
    if (domElement.current) {
      domElement.current.classList.remove('printing')
    }
    setModalOpen(false)
  }, [])

  const onPDFDownloadClick = useCallback(() => {
    handleModalClose()
    setTimeout(window.print, 200)
  }, [handleModalClose])

  const onImageDownloadClick = useCallback(async () => {
    await downloadImage()
    handleModalClose()
  }, [downloadImage, handleModalClose])

  const basemapDataviewInstance = resolvedDataviewInstances?.find(
    (d) => d.config?.type === Generators.Type.Basemap
  )
  const currentBasemap = basemapDataviewInstance?.config?.basemap ?? Generators.BasemapType.Default
  const switchBasemap = () => {
    upsertDataviewInstance({
      id: basemapDataviewInstance?.id,
      config: {
        basemap:
          currentBasemap === Generators.BasemapType.Default
            ? Generators.BasemapType.Satellite
            : Generators.BasemapType.Default,
      },
    })
  }
  const extendedControls = useSelector(isWorkspaceLocation)
  const isAnalyzing = useSelector(selectIsAnalyzing)
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
          {miniGlobeHovered && <MiniGlobeInfo viewport={viewport} />}
        </div>
        <div className={cx('print-hidden', styles.controlsNested)}>
          {extendedControls && !isAnalyzing && <MapSearch />}
          {!isAnalyzing && (
            <IconButton
              icon="plus"
              type="map-tool"
              tooltip={t('map.zoom_in', 'Zoom in')}
              onClick={onZoomInClick}
            />
          )}
          {!isAnalyzing && (
            <IconButton
              icon="minus"
              type="map-tool"
              tooltip={t('map.zoom_out', 'Zoom out')}
              onClick={onZoomOutClick}
            />
          )}
          {extendedControls && (
            <Fragment>
              {!isAnalyzing && <Rulers />}
              {!isAnalyzing && (
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
              {!isAnalyzing && (
                <Tooltip
                  content={
                    currentBasemap === Generators.BasemapType.Default
                      ? t('map.change_basemap_satellite', 'Switch to satellite basemap')
                      : t('map.change_basemap_default', 'Switch to default basemap')
                  }
                  placement="left"
                >
                  <button
                    className={cx(styles.basemapSwitcher, styles[currentBasemap])}
                    onClick={switchBasemap}
                  ></button>
                </Tooltip>
              )}
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
        title="Screenshot preview"
        isOpen={modalOpen}
        onClose={handleModalClose}
        contentClassName={styles.previewContainer}
      >
        <div className={styles.previewPlaceholder}>
          {previewImageLoading || !previewImage ? (
            <Spinner />
          ) : (
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
