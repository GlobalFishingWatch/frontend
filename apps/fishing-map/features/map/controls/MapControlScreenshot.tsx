import { Fragment, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton, Modal, Spinner, Button } from '@globalfishingwatch/ui-components'
import { useDownloadDomElementAsImage } from 'hooks/screen.hooks'
import { setInlineStyles, cleantInlineStyles } from 'utils/dom'
import { selectScreenshotModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { useDOMElement } from 'hooks/dom.hooks'
import { selectIsAnyReportLocation, selectIsAnyVesselLocation } from 'routes/routes.selectors'
import MapScreenshot, { isPrintSupported, MAP_IMAGE_DEBOUNCE } from '../MapScreenshot'
import styles from './MapControls.module.css'

const ScrenshotAreaIds = {
  app: ROOT_DOM_ELEMENT,
  map: 'map',
  'map&Timebar': 'map+timebar',
}

const MapControlScreenshot = ({
  mapLoading = false,
}: {
  mapLoading?: boolean
  onMouseEnter?: () => void
}): React.ReactElement => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const modalOpen = useSelector(selectScreenshotModalOpen)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { dispatchQueryParams } = useLocationConnect()
  const isAnyReportLocation = useSelector(selectIsAnyReportLocation)
  const isVesselLocation = useSelector(selectIsAnyVesselLocation)
  const showScreenshot = !isVesselLocation && !isAnyReportLocation
  const rootElement = useDOMElement()

  const {
    loading,
    previewImage,
    downloadImage,
    resetPreviewImage,
    previewImageLoading,
    generatePreviewImage,
  } = useDownloadDomElementAsImage(rootElement, false)

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

  return (
    <Fragment>
      {modalOpen && <MapScreenshot />}
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

export default MapControlScreenshot
