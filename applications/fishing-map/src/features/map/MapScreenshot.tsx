import React, { Fragment, memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getParser } from 'bowser'
import debounce from 'lodash/debounce'
import { Map } from '@globalfishingwatch/mapbox-gl'
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
export const isPrintSupported = browser.satisfies({
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
    const handleIdle = debounce(() => {
      getMapImage(map).then((image) => {
        setScreenshotImage(image)
      })
    }, 800)

    if (map) {
      map.on('idle', handleIdle)
    }
    return () => {
      if (map) {
        map.off('idle', handleIdle)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

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

export default memo(MapScreenshot)
