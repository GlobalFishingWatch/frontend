import { useCallback, useEffect, useMemo, useState } from 'react'

import { useDeckMap } from 'features/map/map-context.hooks'

export const useDownloadDomElementAsImage = () => {
  const [error, setError] = useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewImageLoading, setPreviewImageLoading] = useState(false)
  const [finished, setFinished] = useState<boolean>(false)
  const map = useDeckMap()

  const getCanvas = useCallback(async (domId: string) => {
    try {
      const domElement = typeof window !== 'undefined' ? document.getElementById(domId || '') : null
      if (domElement) {
        const { snapdom } = await import('@zumer/snapdom')
        const canvas = await snapdom.toCanvas(domElement, {
          exclude: ['.ReactModalPortal'],
        })
        if (canvas) {
          return canvas
        }
        throw new Error('no canvas element found')
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
  }, [])

  const generatePreviewImage = useCallback(
    async (domId: string) => {
      try {
        setPreviewImageLoading(true)
        map?.redraw('previewImage')
        const canvas = await getCanvas(domId)
        setPreviewImage(canvas.toDataURL())
        setPreviewImageLoading(false)
      } catch (e: any) {
        setPreviewImageLoading(false)
      }
    },
    [getCanvas, map]
  )

  const downloadImage = useCallback(
    async (domId: string, fileName = `GFW-fishingmap-${new Date().toLocaleString()}.png`) => {
      const domElement = document.getElementById(domId)
      if (domElement) {
        try {
          setLoading(true)
          const { saveAs } = await import('file-saver')
          const canvas = await getCanvas(domId)
          canvas.toBlob((blob: any) => {
            if (blob) {
              saveAs(blob, fileName)
              setLoading(false)
              setFinished(true)
              return true
            } else {
              setLoading(false)
              setFinished(true)
              setError('No blob canvas')
              return false
            }
          })
        } catch (e: any) {
          setError('Something went wrong generating the screenshot, please try again')
          setLoading(false)
          return false
        }
      } else {
        console.warn('Dom element needed for image download')
      }
    },
    [getCanvas]
  )

  return useMemo(
    () => ({
      loading,
      error,
      finished,
      downloadImage,
      getCanvas,
      previewImage,
      resetPreviewImage,
      generatePreviewImage,
      previewImageLoading,
    }),
    [
      downloadImage,
      error,
      finished,
      generatePreviewImage,
      getCanvas,
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
