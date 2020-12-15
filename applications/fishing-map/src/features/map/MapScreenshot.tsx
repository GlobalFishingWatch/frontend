import React, { useEffect } from 'react'
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
    let afterPrint: any
    if (screenshotMode && imgMap) {
      afterPrint = window.addEventListener('afterprint', () => {
        setScreenshotMode(false)
      })
      // setPrintStyles(true)
      window.print()
    }
    return () => {
      if (afterPrint) {
        window.removeEventListener('afterprint', afterPrint)
      }
    }
  }, [imgMap, screenshotMode, setScreenshotMode])

  if (!screenshotMode || !imgMap) return null

  return (
    <div className={styles.screenshot}>
      <img className={styles.screenshotImg} src={imgMap} alt="map screenshot" />
    </div>
  )
}

export default MapScreenshot
