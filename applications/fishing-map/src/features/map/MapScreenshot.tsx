import React, { Fragment, memo, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
// import { stringify } from 'qs'
// import GFWAPI from '@globalfishingwatch/api-client/dist/api-client'
import { useMapImage } from 'features/map/map.hooks'
import { useScreenshotConnect, useScreenshotLoadingConnect } from 'features/app/app.hooks'
// import { setPrintStyles } from 'utils/dom'
import { getCSSVarValue } from 'utils/dom'
import { useMapboxRef } from './map.context'
import styles from './Map.module.css'

declare global {
  interface Window {
    chrome: any
  }
}

const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
const isPrintSupported = isChrome

type PrintSize = {
  px: number
  in: string
}

function MapScreenshot() {
  const { screenshotMode, setScreenshotMode } = useScreenshotConnect()
  const { setScreenshotLoading } = useScreenshotLoadingConnect()
  const mapboxRef = useMapboxRef()
  const documentFocus = useRef<boolean>(true)
  const printSize = useRef<{ width: PrintSize; height: PrintSize } | undefined>()
  const imgMap = useMapImage(screenshotMode ? mapboxRef.current?.getMap() : null)

  useLayoutEffect(() => {
    const pixelPerInch = window.devicePixelRatio * 96
    const baseSize = parseInt(getCSSVarValue('--base-font-size')) || 10
    const timebarSize = parseFloat(getCSSVarValue('--timebar-size') || '7.2') * baseSize
    const height = window.innerHeight - timebarSize
    printSize.current = {
      width: {
        px: window.innerWidth,
        in: `${window.innerWidth / pixelPerInch}in`,
      },
      height: {
        in: `${height / pixelPerInch}in`,
        px: height,
      },
    }
  }, [])

  useEffect(() => {
    if (screenshotMode && imgMap && documentFocus.current === true) {
      if (isPrintSupported) {
        window.print()
      } else {
        alert('Screenshot image is only available in Chrome')
        // setScreenshotLoading(true)
        // const downloadParams = {
        //   url: window.location.href,
        //   token: GFWAPI.getToken(),
        //   width: printSize.current?.width.px,
        //   height: printSize.current?.height.px,
        //   type: 'pdf',
        // }
        // try {
        //   GFWAPI.download(`http://localhost:3000?${stringify(downloadParams)}`).then((d) => {
        //     setScreenshotLoading(false)
        //   })
        // } catch (e) {
        //   console.warn(e)
        //   setScreenshotLoading(false)
        // }
      }
    }
  }, [imgMap, screenshotMode, setScreenshotLoading])

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
      const isPrintCommand = (e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')
      const isPuppeterCommand = isPrintCommand && e.shiftKey
      if (isPrintCommand || isPuppeterCommand) {
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
    <Fragment>
      <img className={styles.screenshot} src={imgMap} alt="map screenshot" />
      <style>
        {`@page {
          size: ${printSize.current?.width} ${printSize.current?.height};
          margin: 0;
        }`}
      </style>
    </Fragment>,
    canvasDomElement
  )
}

export default memo(MapScreenshot)
