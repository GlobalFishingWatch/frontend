import { Fragment, useCallback, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import {
  IconButton,
  Modal,
  Spinner,
  Button,
  MAIN_DOM_ID,
  Choice,
} from '@globalfishingwatch/ui-components'
import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { useDownloadDomElementAsImage } from 'hooks/screen.hooks'
import { setInlineStyles, cleantInlineStyles } from 'utils/dom'
import { selectScreenshotModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { useDOMElement } from 'hooks/dom.hooks'
import { selectIsAnyReportLocation, selectIsAnyVesselLocation } from 'routes/routes.selectors'
import MapScreenshot, { isPrintSupported, MAP_IMAGE_DEBOUNCE } from '../MapScreenshot'
import { MAP_CONTAINER_ID } from '../map-viewport.hooks'
import styles from './MapControls.module.css'

type ScrenshotArea = 'map' | 'withTimebar' | 'withTimebarAndLegend'
type ScrenshotDOMArea = typeof ROOT_DOM_ELEMENT | typeof MAP_CONTAINER_ID | typeof MAIN_DOM_ID
const ScrenshotAreaIds: Record<ScrenshotArea, ScrenshotDOMArea> = {
  map: MAP_CONTAINER_ID,
  withTimebar: MAIN_DOM_ID,
  withTimebarAndLegend: ROOT_DOM_ELEMENT,
}
const SCREENSHOT_AREA_KEY_ID = 'screenShotAreaId'
const DEFAULT_SCREENSHOT_AREA = ScrenshotAreaIds.withTimebarAndLegend

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
  const [screenshotAreaId, setScreenshotAreaId] = useLocalStorage<ScrenshotDOMArea>(
    SCREENSHOT_AREA_KEY_ID,
    DEFAULT_SCREENSHOT_AREA
  )
  const rootElement = useDOMElement()

  const SCREENSHOT_AREA_OPTIONS: SelectOption<ScrenshotDOMArea>[] = useMemo(
    () =>
      Object.entries(ScrenshotAreaIds).map(([key, value]) => ({
        id: value as ScrenshotDOMArea,
        label: t(`map.screenshotArea.${key}`, key),
      })),
    []
  )

  const {
    loading,
    previewImage,
    downloadImage,
    resetPreviewImage,
    previewImageLoading,
    generatePreviewImage,
  } = useDownloadDomElementAsImage()

  const generateImage = useCallback(
    (domId: string) => {
      resetPreviewImage()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        if (rootElement && domId) {
          rootElement.classList.add('printing')
          setInlineStyles(rootElement)
          // leave some time to
          // 1. apply the styles + timebar to re - render
          // 2. map static image generated with debounced finishes
          timeoutRef.current = setTimeout(() => {
            generatePreviewImage(domId)
          }, MAP_IMAGE_DEBOUNCE + 400)
        }
      }, 100)
    },
    [generatePreviewImage, resetPreviewImage, rootElement]
  )

  const onScreenshotClick = useCallback(() => {
    dispatchQueryParams({ sidebarOpen: true })
    dispatch(setModalOpen({ id: 'screenshot', open: true }))
    generateImage(screenshotAreaId)
  }, [dispatch, dispatchQueryParams, generateImage, screenshotAreaId])

  const handleModalClose = useCallback(() => {
    resetPreviewImage()
    setScreenshotAreaId(DEFAULT_SCREENSHOT_AREA)
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
    if (screenshotAreaId) {
      await downloadImage(screenshotAreaId)
    }
    handleModalClose()
  }, [screenshotAreaId])

  const onSelectScreenshotArea = useCallback(
    (area: ScrenshotDOMArea) => {
      setScreenshotAreaId(area)
      generateImage(area)
    },
    [downloadImage, handleModalClose]
  )

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
        <div className={styles.screenshotArea}>
          <Choice
            options={SCREENSHOT_AREA_OPTIONS}
            size="medium"
            onSelect={(option) => onSelectScreenshotArea(option.id)}
            className={styles.select}
            activeOption={screenshotAreaId}
          />
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