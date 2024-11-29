import { Fragment, memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
// import { getParser } from 'bowser'
import type { Deck } from '@deck.gl/core'
import { getCSSVarValue } from 'utils/dom'
import { useDeckMap } from 'features/map/map-context.hooks'
import styles from './Map.module.css'
import { MAP_WRAPPER_ID } from './map.config'

type PrintSize = {
  px: number
  in: string
}

// TODO: review why it isn't always render propertly, disabled for now
export const isPrintSupported = false
export const MAP_IMAGE_DEBOUNCE = 800
// const browser = getParser(window.navigator.userAgent)
// export const isPrintSupported = browser.satisfies({
//   chrome: '>22',
//   opera: '>30',
//   edge: '>79',
// })

const getMapImage = (map: Deck): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!map) {
      reject('No map instance found')
    }
    const canvas = map.getCanvas()
    if (canvas) {
      map.redraw('screenshot')
      resolve(canvas.toDataURL())
    } else {
      reject('No map canvas found')
    }
  })
}

// Component to render an invisible image with the canvas data so ideally
// when printing with crtl + p the image is there but it is too heavy
function MapScreenshot() {
  const map = useDeckMap()
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
    if (map) {
      getMapImage(map).then((image) => {
        if (image) {
          setScreenshotImage(image)
        }
      })
    }
  }, [map])

  if (!screenshotImage) return null

  // insert the image just below the canvas
  const canvasDomElement = document.getElementById(MAP_WRAPPER_ID)
  if (!canvasDomElement) return null
  const size = isPrintSupported
    ? `${printSize.current?.width.in} ${printSize.current?.height.in}`
    : 'landscape'
  return createPortal(
    <Fragment>
      <img
        id="screenshot-img"
        className={styles.screenshot}
        src={screenshotImage}
        alt="map screenshot"
      />
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
