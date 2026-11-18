import { useCallback, useEffect, useMemo, useState } from 'react'
import * as Sentry from '@sentry/tanstackstart-react'

import { useDeckMap } from 'features/_map/map/map-context.hooks'
import { getSafeElementById } from 'utils/dom'

// output pixels per CSS pixel of the captured area; download() ignores dpr
const SCREENSHOT_SCALE = 2

// 2026-11-17T10-23-45: sortable, locale independent and safe in file names
const getFileTimestamp = () => new Date().toISOString().slice(0, 19).replace(/:/g, '-')

export const useDownloadDomElementAsImage = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const map = useDeckMap()

  const downloadImage = useCallback(
    async (domId: string, filename = `GFW-map-${getFileTimestamp()}`) => {
      const domElement = getSafeElementById(domId)
      if (!domElement) {
        console.warn('Dom element needed for image download')
        return false
      }
      try {
        setLoading(true)
        const { snapdom } = await import('@zumer/snapdom')
        // the deck canvas has no preserveDrawingBuffer, so redraw right before snapdom reads it
        map?.redraw('screenshot')
        const capture = await snapdom(domElement, { scale: SCREENSHOT_SCALE })
        await capture.download({ format: 'png', filename })
        return true
      } catch (e) {
        console.warn('Something went wrong generating the screenshot', e)
        Sentry.captureException(e, { tags: { feature: 'map-screenshot' } })
        return false
      } finally {
        setLoading(false)
      }
    },
    [map]
  )

  return useMemo(() => ({ downloadImage, loading }), [downloadImage, loading])
}

export const useOnScreen = (ref: any, rootMargin = '0px') => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { rootMargin }
    )

    const currentElement = ref?.current

    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      observer.unobserve(currentElement)
    }
  }, [])

  return isVisible
}

export const useScreenDPI = () => {
  const [dpi, setDpi] = useState<number>()

  useEffect(() => {
    const dpiElement = document.createElement('div')
    dpiElement.id = 'dpi'
    dpiElement.style.width = dpiElement.style.height = '1in'
    dpiElement.style.position = 'absolute'
    dpiElement.style.top = dpiElement.style.left = '-10000px'
    const body = document.getElementsByTagName('body')[0]
    if (body) {
      body.appendChild(dpiElement)
      setDpi(dpiElement.offsetHeight)
      body.removeChild(dpiElement)
    }
  }, [])

  return dpi
}
