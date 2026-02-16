import { Fragment, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import type { Entries } from 'type-fest'

import { isPrintSupported } from '@globalfishingwatch/react-hooks'
import type { MAIN_DOM_ID, SelectOption } from '@globalfishingwatch/ui-components'
import { Button, Choice, IconButton, Modal, Spinner } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectScreenshotModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { useDOMElement } from 'hooks/dom.hooks'
import { useDownloadDomElementAsImage } from 'hooks/screen.hooks'
import { useReplaceQueryParams } from 'router/routes.hook'
import { selectIsAnyReportLocation, selectIsAnyVesselLocation } from 'router/routes.selectors'
import { cleantInlineStyles, setInlineStyles } from 'utils/dom'

import type { MAP_CONTAINER_ID } from '../map-viewport.hooks'

import { ScrenshotAreaIds, selectScreenshotAreaId, setScreenshotAreaId } from './screenshot.slice'

import styles from './MapControls.module.css'

type ScrenshotDOMArea = typeof ROOT_DOM_ELEMENT | typeof MAP_CONTAINER_ID | typeof MAIN_DOM_ID

const MapControlScreenshot = ({
  mapLoading = false,
}: {
  mapLoading?: boolean
  onMouseEnter?: () => void
}): React.ReactElement<any> => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const modalOpen = useSelector(selectScreenshotModalOpen)
  const timeoutRef = useRef<NodeJS.Timeout>(undefined)
  const isAnyReportLocation = useSelector(selectIsAnyReportLocation)
  const isVesselLocation = useSelector(selectIsAnyVesselLocation)
  const showScreenshot = !isVesselLocation && !isAnyReportLocation
  const screenshotAreaId = useSelector(selectScreenshotAreaId)
  const rootElement = useDOMElement()

  const SCREENSHOT_AREA_OPTIONS: SelectOption<ScrenshotDOMArea>[] = useMemo(
    () =>
      (Object.entries(ScrenshotAreaIds) as Entries<typeof ScrenshotAreaIds>).map(
        ([key, value]) => ({
          id: value as ScrenshotDOMArea,
          label: t((t) => t.map.screenshotArea[key], { defaultValue: key }),
        })
      ),
    [t]
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
          timeoutRef.current = setTimeout(() => {
            generatePreviewImage(domId)
          }, 400)
        }
      }, 100)
    },
    [generatePreviewImage, resetPreviewImage, rootElement]
  )

  const onScreenshotClick = useCallback(() => {
    if (screenshotAreaId === ScrenshotAreaIds.withTimebarAndLegend) {
      replaceQueryParams({ sidebarOpen: true })
    }
    dispatch(setModalOpen({ id: 'screenshot', open: true }))
    generateImage(screenshotAreaId)
  }, [dispatch, generateImage, screenshotAreaId])

  const handleModalClose = useCallback(() => {
    resetPreviewImage()
    if (rootElement) {
      rootElement.classList.remove('printing')
      cleantInlineStyles(rootElement)
    }
    dispatch(setModalOpen({ id: 'screenshot', open: false }))
  }, [dispatch, resetPreviewImage, rootElement])

  const onPDFDownloadClick = useCallback(() => {
    handleModalClose()
    setTimeout(window.print, 200)
  }, [handleModalClose])

  const onImageDownloadClick = useCallback(async () => {
    if (screenshotAreaId) {
      await downloadImage(screenshotAreaId)
    }
    handleModalClose()
  }, [downloadImage, handleModalClose, screenshotAreaId])

  const onSelectScreenshotArea = useCallback(
    (area: ScrenshotDOMArea) => {
      dispatch(setScreenshotAreaId(area))
      if (area === ScrenshotAreaIds.withTimebarAndLegend) {
        replaceQueryParams({ sidebarOpen: true })
      }
      generateImage(area)
    },
    [dispatch, generateImage]
  )

  return (
    <Fragment>
      {showScreenshot && (
        <IconButton
          icon="camera"
          type="map-tool"
          loading={loading}
          disabled={mapLoading || loading}
          tooltip={
            mapLoading || loading ? t((t) => t.map.mapLoadingWait) : t((t) => t.map.captureMap)
          }
          onClick={onScreenshotClick}
        />
      )}
      <Modal
        appSelector={ROOT_DOM_ELEMENT}
        title={t((t) => t.map.screenshotPreview)}
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
            {t((t) => t.common.dismiss)}
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
              {t((t) => t.map.screenshotDownload)}
            </Button>
          </div>
        </div>
      </Modal>
    </Fragment>
  )
}

export default MapControlScreenshot
