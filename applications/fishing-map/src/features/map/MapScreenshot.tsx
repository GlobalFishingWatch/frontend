import React, { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getParser } from 'bowser'
import { Map } from 'mapbox-gl'
import { getCSSVarValue } from 'utils/dom'
import styles from './Map.module.css'

declare global {
  interface Window {
    chrome: any
  }
}

type PrintSize = {
  px: number
  in: string
}

const browser = getParser(window.navigator.userAgent)
const isPrintSupported = browser.satisfies({
  chrome: '>22',
  opera: '>30',
  edge: '>79',
})

export const getMapImage = (map: Map): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!map) {
      reject('No map instance found')
    }
    map.once('render', () => {
      const canvas = map.getCanvas()
      resolve(canvas.toDataURL())
    })
    // trigger render
    ;(map as any)._render()
  })
}

function MapScreenshot({ map }: { map: Map }) {
  const [screenshotImage, setScreenshotImage] = useState<string | null>(null)
  const printSize = useRef<{ width: PrintSize; height: PrintSize } | undefined>()

  const updatePrintSize = useCallback(() => {
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

  useLayoutEffect(() => {
    if (map) {
      updatePrintSize()
    }
  }, [map, updatePrintSize])

  const generateScrenshotImage = useCallback(() => {
    console.log('generating')
    updatePrintSize()
    return getMapImage(map)
      .then((image) => {
        setScreenshotImage(image)
        return true
      })
      .catch((e) => {
        console.warn(e)
        setScreenshotImage('')
        return false
      })
  }, [map, updatePrintSize])

  useEffect(() => {
    let beforeprint: any
    let beforeprintMedia: any
    const mediaQueryList = window.matchMedia ? window.matchMedia('print') : null
    const mediaQueryCb = (mql: any) => {
      if (mql.matches) {
        generateScrenshotImage()
      }
    }
    if (map) {
      if (mediaQueryList) {
        beforeprintMedia = mediaQueryList.addEventListener('change', mediaQueryCb)
      } else {
        beforeprint = window.addEventListener('beforeprint', generateScrenshotImage)
      }
    }
    return () => {
      if (beforeprint) {
        window.removeEventListener('beforeprint', beforeprint)
      }
      if (beforeprintMedia && mediaQueryList) {
        mediaQueryList.removeEventListener('change', mediaQueryCb)
      }
    }
  }, [map, generateScrenshotImage])

  if (!screenshotImage) return null

  // insert the image just below the canvas
  const canvasDomElement = document.querySelector('.mapboxgl-canvas-container')
  if (!canvasDomElement) return null
  const size = isPrintSupported
    ? `${printSize.current?.width.in} ${printSize.current?.height.in}`
    : 'landscape'
  return createPortal(
    <Fragment>
      <img className={styles.screenshot} src={screenshotImage} alt="map screenshot" />
      <style>
        {`@page {
          size: ${size};
          margin: 0;
        }`}
      </style>
    </Fragment>,
    canvasDomElement
  )
}

export default MapScreenshot
