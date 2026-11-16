import { useCallback, useEffect, useMemo, useState } from 'react'

import { useDeckMap } from 'features/_map/map/map-context.hooks'
import { getSafeElementById } from 'utils/dom'

export const useDownloadDomElementAsImage = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const map = useDeckMap()

  const downloadImage = useCallback(
    async (domId: string, filename = `GFW-fishingmap-${new Date().toLocaleString()}.png`) => {
      const domElement = getSafeElementById(domId)
      if (!domElement) {
        console.warn('Dom element needed for image download')
        return false
      }
      try {
        setLoading(true)
        map?.redraw('screenshot')
        const { snapdom } = await import('@zumer/snapdom')
        const capture = await snapdom(domElement, {
          exclude: ['[data-modal-overlay]'],
          dpr: 2,
          scale: 2,
        })
        await capture.download({ format: 'png', filename, scale: 4 })
        return true
      } catch (e) {
        console.warn('Something went wrong generating the screenshot', e)
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
