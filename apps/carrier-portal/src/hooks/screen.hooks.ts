import { useState, useEffect, useCallback, useMemo, useLayoutEffect, useRef } from 'react'
import { ResizeObserver } from '@juggle/resize-observer'
import { saveAs } from 'file-saver'
import setInlineStyles from 'utils/dom'
import { formatUTCDate } from 'utils'
import { DOWNLOAD_NAME_PREFIX, DOWNLOAD_DATE_FORMAT } from 'data/constants'
import useDebounce from './debounce.hooks'

export const useSmallScreen = (): boolean => {
  const [isSmall, setSmall] = useState<boolean>(window.innerWidth <= 720)

  const onWindowResize = () => {
    setSmall(window.innerWidth <= 720)
  }

  useEffect(() => {
    window.addEventListener('resize', onWindowResize, { passive: true })
    return () => {
      window.removeEventListener('resize', onWindowResize)
    }
  }, [])

  return isSmall
}

interface UseDimensionsParams {
  resize?: boolean
  debounce?: number
}
interface UseSizeMeasures {
  width?: number
  height?: number
}

type UseSizeResponse = [(node: HTMLElement) => void, UseSizeMeasures, HTMLElement | null]

export const useElementSize = ({
  resize = true,
  debounce = 0,
}: UseDimensionsParams = {}): UseSizeResponse => {
  const [dimensions, setDimensions] = useState<UseSizeMeasures>({})
  const [node, setNode] = useState<HTMLElement | null>(null)
  const debouncedDimensions = useDebounce<UseSizeMeasures>(dimensions, debounce)

  const ref = useCallback((node) => {
    setNode(node)
  }, [])

  const getObserverDimensions = useCallback((entries) => {
    const { width, height } = entries[0].contentRect
    setDimensions({ width, height })
  }, [])

  const containerResizeObserver = useMemo(
    () => (resize ? new ResizeObserver(getObserverDimensions) : null),
    [getObserverDimensions, resize]
  )

  useLayoutEffect(() => {
    if (node) {
      const getDimensions = () =>
        window.requestAnimationFrame(() => {
          const rect = node !== null && node.getBoundingClientRect()
          const dimensions = rect ? { width: rect.width, height: rect.height } : {}
          setDimensions(dimensions)
        })
      getDimensions()
    }
  }, [resize, node])

  useEffect(() => {
    if (node && containerResizeObserver) {
      containerResizeObserver.observe(node)
      return () => {
        if (containerResizeObserver) {
          containerResizeObserver.disconnect()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node])

  return [
    ref,
    debounce > 0 && debouncedDimensions.width !== undefined ? debouncedDimensions : dimensions,
    node,
  ]
}

export const useClickOutside = (callback: any) => {
  const [node, setNode] = useState<HTMLElement | null>(null)

  const ref = useCallback((node) => {
    setNode(node)
  }, [])

  const handleClickOutside = (event: MouseEvent) => {
    if (node && !node.contains(event.target as Node)) {
      callback()
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  })

  return ref
}

export const useDownloadDomElementAsImage = (
  domElement: HTMLElement | null,
  autoDownload = true,
  fileName?: string
) => {
  const [error, setError] = useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [finished, setFinished] = useState<boolean>(false)
  const html2canvasRef = useRef<any>(null)

  const getCanvas = useCallback(async () => {
    if (!html2canvasRef.current) {
      try {
        const node = await import('html2canvas')
        html2canvasRef.current = node.default
      } catch (e) {
        console.warn(e)
        setError('Error importing html2canvas dependency')
      }
    }
    return html2canvasRef.current(domElement)
  }, [domElement])

  const downloadImage = useCallback(
    async (
      fileName = `${DOWNLOAD_NAME_PREFIX}-${formatUTCDate(Date.now(), DOWNLOAD_DATE_FORMAT)}.png`
    ) => {
      if (domElement) {
        try {
          setLoading(true)
          setInlineStyles(domElement)
          const canvas = await getCanvas()
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
        } catch (e) {
          setError('Something went wrong generating the screenshot, please try again')
          setLoading(false)
          return false
        }
      } else {
        console.warn('Dom element needed for image download')
      }
    },
    [domElement, getCanvas]
  )

  useEffect(() => {
    if (!domElement) {
      setError(null)
      setLoading(false)
      setFinished(false)
    }
  }, [domElement])

  useEffect(() => {
    if (domElement && autoDownload) {
      downloadImage(fileName)
    }
  }, [downloadImage, domElement, autoDownload, fileName])

  return { loading, error, finished, downloadImage, getCanvas }
}
