import { Fragment, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import type { Entries } from 'type-fest'

import type {
  MAIN_DOM_ID,
  SelectOption,
  SPLIT_VIEW_DOM_ID,
} from '@globalfishingwatch/ui-components'
import { Button, Choice, IconButton, Modal, Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectScreenshotModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { useDOMElement } from 'hooks/dom.hooks'
import { useDownloadDomElementAsImage } from 'hooks/screen.hooks'
import { useReplaceQueryParams } from 'router/routes.hook'
import { selectIsAnyReportLocation, selectIsAnyVesselLocation } from 'router/routes.selectors'
import { getSafeElementById } from 'utils/dom'

import { selectIsMapInteractionLoading } from '../map.slice'
import type { MAP_CONTAINER_ID } from '../map-viewport.hooks'

import type { ScreenshotAspectRatio } from './screenshot.slice'
import {
  SCREENSHOT_ASPECT_RATIOS,
  ScrenshotAreaIds,
  selectScreenshotAreaId,
  selectScreenshotAspectRatio,
  setLabelSizeScale,
  setScreenshotAreaId,
  setScreenshotAspectRatio,
} from './screenshot.slice'
import { applyAspectRatio, resetAspectRatio } from './screenshot.utils'

import styles from './MapControls.module.css'

type ScrenshotDOMArea = typeof SPLIT_VIEW_DOM_ID | typeof MAP_CONTAINER_ID | typeof MAIN_DOM_ID

const MapControlScreenshot = ({
  mapLoading,
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
  const screenshotAspectRatio = useSelector(selectScreenshotAspectRatio)
  const interactionLoading = useSelector(selectIsMapInteractionLoading)
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

  const ASPECT_RATIO_OPTIONS: SelectOption<ScreenshotAspectRatio>[] = useMemo(
    () => [
      { id: 'current', label: t((t) => t.map.screenshotAspectRatio.current) },
      { id: '4:3', label: '4:3' },
      { id: '9:16', label: '9:16' },
    ],
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
    (domId: string, aspectRatio: ScreenshotAspectRatio) => {
      resetPreviewImage()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        if (rootElement && domId) {
          rootElement.classList.add('printing')
          // measure the area at its natural size, not one shrunk by a previous ratio
          resetAspectRatio()
          const ratio = SCREENSHOT_ASPECT_RATIOS[aspectRatio]
          const element = ratio ? getSafeElementById(domId) : null
          dispatch(setLabelSizeScale(element && ratio ? applyAspectRatio(element, ratio) : 1))
          // leave some time to
          // 1. apply the styles + timebar to re - render
          // 2. let deck resize to the new aspect ratio and redraw the labels
          timeoutRef.current = setTimeout(() => {
            generatePreviewImage(domId)
          }, 400)
        }
      }, 100)
    },
    [dispatch, generatePreviewImage, resetPreviewImage, rootElement]
  )

  const onScreenshotClick = useCallback(() => {
    if (screenshotAreaId === ScrenshotAreaIds.withTimebarAndLegend) {
      replaceQueryParams({ sidebarOpen: true })
    }
    dispatch(setModalOpen({ id: 'screenshot', open: true }))
    generateImage(screenshotAreaId, screenshotAspectRatio)
  }, [dispatch, generateImage, screenshotAreaId, screenshotAspectRatio])

  const handleModalClose = useCallback(() => {
    resetPreviewImage()
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    resetAspectRatio()
    dispatch(setLabelSizeScale(1))
    if (rootElement) {
      rootElement.classList.remove('printing')
    }
    dispatch(setModalOpen({ id: 'screenshot', open: false }))
  }, [dispatch, resetPreviewImage, rootElement])

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
      generateImage(area, screenshotAspectRatio)
    },
    [dispatch, generateImage, screenshotAspectRatio]
  )

  const onSelectAspectRatio = useCallback(
    (aspectRatio: ScreenshotAspectRatio) => {
      dispatch(setScreenshotAspectRatio(aspectRatio))
      generateImage(screenshotAreaId, aspectRatio)
    },
    [dispatch, generateImage, screenshotAreaId]
  )

  // capturing mid-fetch freezes a popup showing its spinner instead of its contents
  const captureDisabled = mapLoading || interactionLoading || loading
  const previewPending = previewImageLoading || !previewImage

  return (
    <Fragment>
      {showScreenshot && (
        <IconButton
          icon="camera"
          type="map-tool"
          loading={loading}
          disabled={captureDisabled}
          tooltip={captureDisabled ? t((t) => t.map.mapLoadingWait) : t((t) => t.map.captureMap)}
          onClick={onScreenshotClick}
        />
      )}
      <Modal
        title={t((t) => t.map.screenshotPreview)}
        isOpen={modalOpen}
        onClose={handleModalClose}
        className={cx({ [styles.screenshotModal]: !previewImageLoading && previewImage })}
        contentClassName={styles.previewContainer}
      >
        <div className={styles.previewPlaceholder}>
          {previewPending ? (
            <Spinner />
          ) : (
            <img className={styles.previewImage} src={previewImage} alt="screenshot preview" />
          )}
        </div>
        <div className={styles.previewFooter}>
          <Choice
            options={SCREENSHOT_AREA_OPTIONS}
            onSelect={(option) => onSelectScreenshotArea(option.id)}
            activeOption={screenshotAreaId}
          />
          <Choice
            options={ASPECT_RATIO_OPTIONS}
            onSelect={(option) => onSelectAspectRatio(option.id)}
            activeOption={screenshotAspectRatio}
          />
          <Button
            id="image-preview-download"
            loading={loading}
            disabled={previewPending}
            onClick={onImageDownloadClick}
          >
            {t((t) => t.map.screenshotDownload)}
          </Button>
        </div>
      </Modal>
    </Fragment>
  )
}

export default MapControlScreenshot
