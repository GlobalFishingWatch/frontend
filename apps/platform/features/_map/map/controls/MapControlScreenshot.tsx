import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import type { Entries } from 'type-fest'
import { useWindowSize } from 'usehooks-ts'

import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Button, IconButton, Select, SPLIT_VIEW_DOM_ID } from '@globalfishingwatch/ui-components'

import { setUserSetting } from 'features/_user/user.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectScreenshotModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { useDOMElement } from 'hooks/dom.hooks'
import { useDownloadDomElementAsImage } from 'hooks/screen.hooks'
import { useReplaceQueryParams } from 'router/routes.hook'
import { selectIsAnyReportLocation, selectIsAnyVesselLocation } from 'router/routes.selectors'
import { getSafeElementById } from 'utils/dom'

import { selectIsMapInteractionLoading } from '../map.slice'

import type { ScreenshotAspectRatio, ScrenshotDOMArea } from './screenshot.slice'
import {
  SCREENSHOT_ASPECT_RATIOS,
  ScrenshotAreaIds,
  selectScreenshotAreaId,
  selectScreenshotAspectRatio,
  setLabelSizeScale,
} from './screenshot.slice'
import { applyScreenshotLayout, resetScreenshotLayout } from './screenshot.utils'

import styles from './MapControls.module.css'

const MapControlScreenshot = ({
  mapLoading,
}: {
  mapLoading?: boolean
  onMouseEnter?: () => void
}): React.ReactElement<any> => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const editorOpen = useSelector(selectScreenshotModalOpen)
  const isAnyReportLocation = useSelector(selectIsAnyReportLocation)
  const isVesselLocation = useSelector(selectIsAnyVesselLocation)
  const showScreenshot = !isVesselLocation && !isAnyReportLocation
  const screenshotAreaId = useSelector(selectScreenshotAreaId)
  const screenshotAspectRatio = useSelector(selectScreenshotAspectRatio)
  const interactionLoading = useSelector(selectIsMapInteractionLoading)
  const rootElement = useDOMElement()
  const { loading, downloadImage } = useDownloadDomElementAsImage()
  const { width: windowWidth = 0, height: windowHeight = 0 } = useWindowSize({
    initializeWithValue: false,
  })

  const SCREENSHOT_AREA_OPTIONS: SelectOption<ScrenshotDOMArea>[] = useMemo(
    () =>
      (Object.entries(ScrenshotAreaIds) as Entries<typeof ScrenshotAreaIds>).map(
        ([key, value]) => ({
          id: value,
          label: t((t) => t.map.screenshotArea[key], { defaultValue: key }),
        })
      ),
    [t]
  )

  const ASPECT_RATIO_OPTIONS: SelectOption<ScreenshotAspectRatio>[] = useMemo(
    () =>
      (Object.keys(SCREENSHOT_ASPECT_RATIOS) as ScreenshotAspectRatio[]).map((id) => {
        const labelString = id === 'current' ? t((t) => t.map.screenshotAspectRatio.current) : id
        // 'current' previews the window's shape
        const ratio =
          SCREENSHOT_ASPECT_RATIOS[id] ?? (windowHeight ? windowWidth / windowHeight : 16 / 10)
        return {
          id,
          labelString,
          label: (
            <span className={styles.aspectRatioOption}>
              <span className={styles.aspectRatioBoxSlot}>
                <span
                  className={styles.aspectRatioBox}
                  style={{
                    width: `${ratio >= 1 ? 1.6 : 1.6 * ratio}rem`,
                    height: `${ratio >= 1 ? 1.6 / ratio : 1.6}rem`,
                  }}
                />
              </span>
              {labelString}
            </span>
          ),
        }
      }),
    [t, windowWidth, windowHeight]
  )

  const closeEditor = useCallback(() => {
    dispatch(setModalOpen({ id: 'screenshot', open: false }))
  }, [dispatch])

  // .printing restyles the app for capture; the area attribute hides what falls outside it
  useEffect(() => {
    if (!editorOpen || !rootElement) return
    rootElement.classList.add('printing')
    rootElement.setAttribute('data-screenshot-area', screenshotAreaId)
    return () => {
      rootElement.classList.remove('printing')
      rootElement.removeAttribute('data-screenshot-area')
    }
  }, [editorOpen, rootElement, screenshotAreaId])

  // reshape the live app container to the ratio and scale it into the centre of the screen
  useEffect(() => {
    const container = editorOpen ? getSafeElementById(SPLIT_VIEW_DOM_ID) : null
    if (!container) return
    const applyLayout = () => {
      const labelSizeScale = applyScreenshotLayout(
        container,
        SCREENSHOT_ASPECT_RATIOS[screenshotAspectRatio]
      )
      dispatch(setLabelSizeScale(labelSizeScale))
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEditor()
    }
    applyLayout()
    window.addEventListener('resize', applyLayout)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('resize', applyLayout)
      window.removeEventListener('keydown', onKeyDown)
      resetScreenshotLayout()
      dispatch(setLabelSizeScale(1))
    }
  }, [closeEditor, dispatch, editorOpen, screenshotAspectRatio])

  const openEditor = useCallback(() => {
    if (screenshotAreaId === ScrenshotAreaIds.withTimebarAndLegend) {
      replaceQueryParams({ sidebarOpen: true })
    }
    dispatch(setModalOpen({ id: 'screenshot', open: true }))
  }, [dispatch, replaceQueryParams, screenshotAreaId])

  const onSelectScreenshotArea = useCallback(
    (option: SelectOption<ScrenshotDOMArea>) => {
      dispatch(
        setUserSetting({
          mapScreenshot: { areaId: option.id, aspectRatio: screenshotAspectRatio },
        })
      )
      if (option.id === ScrenshotAreaIds.withTimebarAndLegend) {
        replaceQueryParams({ sidebarOpen: true })
      }
    },
    [dispatch, replaceQueryParams, screenshotAspectRatio]
  )

  const onSelectAspectRatio = useCallback(
    (option: SelectOption<ScreenshotAspectRatio>) => {
      dispatch(
        setUserSetting({
          mapScreenshot: { areaId: screenshotAreaId, aspectRatio: option.id },
        })
      )
    },
    [dispatch, screenshotAreaId]
  )

  const onDownloadClick = useCallback(async () => {
    await downloadImage(screenshotAreaId)
    closeEditor()
  }, [closeEditor, downloadImage, screenshotAreaId])

  // capturing mid-fetch freezes a popup showing its spinner instead of its contents
  const captureDisabled = mapLoading || interactionLoading || loading

  return (
    <Fragment>
      {showScreenshot && (
        <IconButton
          icon="camera"
          type="map-tool"
          loading={loading}
          disabled={captureDisabled}
          tooltip={captureDisabled ? t((t) => t.map.mapLoadingWait) : t((t) => t.map.captureMap)}
          tooltipPlacement="left"
          onClick={openEditor}
        />
      )}
      {/* portaled: this button lives inside the app container the editor scales down */}
      {editorOpen &&
        createPortal(
          <Fragment>
            <div className={styles.screenshotBackdrop} />
            <header className={styles.screenshotHeader}>
              <label>{t((t) => t.map.screenshotPreview)}</label>
              <IconButton icon="close" tooltip={t((t) => t.common.close)} onClick={closeEditor} />
            </header>
            <footer className={styles.screenshotFooter}>
              <Select
                label={t((t) => t.map.screenshotAreaLabel)}
                options={SCREENSHOT_AREA_OPTIONS}
                selectedOption={SCREENSHOT_AREA_OPTIONS.find((o) => o.id === screenshotAreaId)}
                onSelect={onSelectScreenshotArea}
                direction="top"
                containerClassName={styles.screenshotSelect}
              />
              <Select
                label={t((t) => t.map.screenshotAspectRatioLabel)}
                options={ASPECT_RATIO_OPTIONS}
                selectedOption={ASPECT_RATIO_OPTIONS.find((o) => o.id === screenshotAspectRatio)}
                onSelect={onSelectAspectRatio}
                direction="top"
                containerClassName={styles.screenshotSelect}
              />
              <Button
                id="image-preview-download"
                loading={loading}
                disabled={captureDisabled}
                onClick={onDownloadClick}
              >
                {t((t) => t.map.screenshotDownload)}
              </Button>
            </footer>
          </Fragment>,
          document.body
        )}
    </Fragment>
  )
}

export default MapControlScreenshot
