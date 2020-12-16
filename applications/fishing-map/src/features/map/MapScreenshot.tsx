import React, { memo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useMapImage } from 'features/map/map.hooks'
import { useScreenshotConnect } from 'features/app/app.hooks'
// import { setPrintStyles } from 'utils/dom'
import { useMapboxRef } from './map.context'
import styles from './Map.module.css'

function MapScreenshot() {
  const { screenshotMode, setScreenshotMode } = useScreenshotConnect()
  const mapboxRef = useMapboxRef()
  const imgMap = useMapImage(screenshotMode ? mapboxRef.current?.getMap() : null)

  useEffect(() => {
    if (screenshotMode && imgMap) {
      window.print()
    }
  }, [imgMap, screenshotMode])

  useEffect(() => {
    const afterPrintCb = () => setScreenshotMode(false)
    const afterPrint: any = window.addEventListener('afterprint', afterPrintCb)

    // if (window.matchMedia) {
    //   const mediaQueryList = window.matchMedia('print')
    //   mediaQueryList.addEventListener('change', function (mql) {
    //     if (!mql.matches) {
    //       afterPrintCb()
    //     }
    //   })
    // }
    return () => {
      window.removeEventListener('afterprint', afterPrint)
    }
  }, [setScreenshotMode])

  useEffect(() => {
    const enableScreenshotMode = () => {
      setScreenshotMode(true)
      documentFocus.current = false
    }
    const disableScreenshotMode = () => {
      setScreenshotMode(false)
      documentFocus.current = true
    }
    const onMouseEnter = document.addEventListener('mouseenter', disableScreenshotMode)
    const onMouseLeave = document.addEventListener('mouseleave', enableScreenshotMode)
    const onKeyDown = document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        enableScreenshotMode()
      }
    })
    return () => {
      document.removeEventListener('mouselenter', onMouseEnter as any)
      document.removeEventListener('mouseleave', onMouseLeave as any)
      document.removeEventListener('keydown', onKeyDown as any)
    }
  }, [setScreenshotMode])

  if (!screenshotMode || !imgMap) return null

  // insert the image just below the canvas
  const canvasDomElement = document.querySelector('.mapboxgl-canvas-container')
  if (!canvasDomElement) return null

  return createPortal(
    <div className={styles.screenshot}>
      <img className={styles.screenshotImg} src={imgMap} alt="map screenshot" />
    </div>,
    canvasDomElement
  )
}

export default memo(MapScreenshot)
