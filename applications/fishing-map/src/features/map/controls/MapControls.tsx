import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
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
import { Generators } from '@globalfishingwatch/layer-composer'
import { getOceanAreaName } from '@globalfishingwatch/ocean-areas'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectDataviewInstancesResolved } from 'features/workspace/workspace.selectors'
import Rulers from 'features/map/controls/Rulers'
import useViewport, { useMapBounds } from 'features/map/map-viewport.hooks'
import { isWorkspaceLocation } from 'routes/routes.selectors'
import { useDownloadDomElementAsImage } from 'hooks/screen.hooks'
import setInlineStyles from 'utils/dom'
import { isPrintSupported } from '../MapScreenshot'
import styles from './MapControls.module.css'
import MapSearch from './MapSearch'

const MapControls = ({
  mapLoading = false,
  onMouseEnter,
}: {
  mapLoading?: boolean
  onMouseEnter: () => void
}): React.ReactElement => {
  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)
  const resolvedDataviewInstances = useSelector(selectDataviewInstancesResolved)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const domElement = useRef<HTMLElement>()
  const {
    loading,
    downloadImage,
    previewImage,
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

  const onZoomInClick = useCallback(() => {
    setMapCoordinates({ latitude, longitude, zoom: zoom + 1 })
  }, [latitude, longitude, setMapCoordinates, zoom])

  const onZoomOutClick = useCallback(() => {
    setMapCoordinates({ latitude, longitude, zoom: Math.max(1, zoom - 1) })
  }, [latitude, longitude, setMapCoordinates, zoom])

  const onScreenshotClick = useCallback(() => {
    if (domElement.current) {
      domElement.current.classList.add('printing')
      setInlineStyles(domElement.current)
      generatePreviewImage()
      setModalOpen(true)
    }
  }, [generatePreviewImage])

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
  return (
    <div className={styles.mapControls} onMouseEnter={onMouseEnter}>
      <MiniGlobe
        className={styles.miniglobe}
        size={60}
        viewportThickness={3}
        bounds={bounds}
        center={{ latitude, longitude }}
      />
      <div className={cx('print-hidden', styles.controlsNested)}>
        {extendedControls && <MapSearch />}
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
        {extendedControls && (
          <Fragment>
            <Rulers />
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
            <IconButton
              type="map-tool"
              tooltip={t('map.loading', 'Map loading')}
              loading={mapLoading}
              className={cx(styles.loadingBtn, { [styles.visible]: mapLoading })}
            />
          </Fragment>
        )}
      </div>
      <Modal
        title="Screenshot preview"
        isOpen={modalOpen}
        onClose={handleModalClose}
        contentClassName={styles.previewContainer}
      >
        <div className={styles.previewPlaceholder}>
          {previewImageLoading ? (
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
    </div>
  )
}

export default MapControls
