/* eslint-disable @next/next/no-img-element */
import { Fragment, memo, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
// import { getParser } from 'bowser'
import type { Deck } from '@deck.gl/core'

import { usePrintSize } from '@globalfishingwatch/react-hooks'

import { useDeckMap } from 'features/map/map-context.hooks'

import { MAP_WRAPPER_ID } from './map.config'

import styles from './Map.module.css'

export const MAP_IMAGE_DEBOUNCE = 800

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
  const printSize = usePrintSize()

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

  return createPortal(
    <Fragment>
      <img
        id="map-screenshot-img"
        className={styles.screenshot}
        src={screenshotImage}
        alt="map screenshot"
      />
      <style>
        {`@page {
          size: ${printSize};
          margin: 0;
        }`}
      </style>
    </Fragment>,
    canvasDomElement
  )
}

export default memo(MapScreenshot)
