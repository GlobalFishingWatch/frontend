import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CaptureResult } from '@zumer/snapdom'

import { useDeckMap } from 'features/map/map-context.hooks'
import { getSafeElementById } from 'utils/dom'

export const useDownloadDomElementAsImage = () => {
  const [error, setError] = useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [capture, setCapture] = useState<CaptureResult | null>(null)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewImageLoading, setPreviewImageLoading] = useState(false)
  const [finished, setFinished] = useState<boolean>(false)
  const map = useDeckMap()

  const getCapture = useCallback(async (domId: string) => {
    try {
      const domElement = getSafeElementById(domId)
      if (domElement) {
        const { snapdom } = await import('@zumer/snapdom')
        const capture = await snapdom(domElement, {
          exclude: ['.ReactModalPortal'],
          dpr: 2,
          scale: 2,
        })
        setCapture(capture)
        if (capture) {
          return capture
        }
        throw new Error('no capture element found')
      } else {
        throw new Error('no DOM element to use in snapdom')
      }
    } catch (e: any) {
      console.warn(e)
      setError(e.message)
      throw e
    }
  }, [])

  const resetPreviewImage = useCallback(() => {
    setPreviewImage('')
    setCapture(null)
  }, [])

  const generatePreviewImage = useCallback(
    async (domId: string) => {
      try {
        setPreviewImageLoading(true)
        map?.redraw('previewImage')
        const capture = await getCapture(domId)
        const img = await capture.toPng()
        setPreviewImage(img.src)
        setPreviewImageLoading(false)
      } catch (e: any) {
        setPreviewImageLoading(false)
      }
    },
    [getCapture, map]
  )

  const downloadImage = useCallback(
    async (domId: string, filename = `GFW-fishingmap-${new Date().toLocaleString()}.png`) => {
      const domElement = document.getElementById(domId)
      if (domElement) {
        try {
          setLoading(true)
          if (capture) {
            capture.download({ format: 'png', filename, dpr: 2, scale: 2 })
            setLoading(false)
            setFinished(true)
            return true
          } else {
            setLoading(false)
            setFinished(true)
            setError('No blob canvas')
            return false
          }
        } catch (e: any) {
          setError('Something went wrong generating the screenshot, please try again')
          setLoading(false)
          return false
        }
      } else {
        console.warn('Dom element needed for image download')
      }
    },
    [capture]
  )

  return useMemo(
    () => ({
      downloadImage,
      error,
      finished,
      generatePreviewImage,
      loading,
      previewImage,
      previewImageLoading,
      resetPreviewImage,
    }),
    [
      downloadImage,
      error,
      finished,
      generatePreviewImage,
      loading,
      previewImage,
      previewImageLoading,
      resetPreviewImage,
    ]
  )
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
