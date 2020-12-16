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
