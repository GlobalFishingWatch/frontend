import { useCallback, useEffect, useRef,useState } from 'react'
import { saveAs } from 'file-saver'

import setInlineStyles from 'utils/dom'

export const useDownloadDomElementAsImage = (
  domElement: HTMLElement | undefined,
  autoDownload = true,
  fileName?: string
) => {
  const [error, setError] = useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewImageLoading, setPreviewImageLoading] = useState(false)
  const [finished, setFinished] = useState<boolean>(false)
  const html2canvasRef = useRef<any>(null)

  const getCanvas = useCallback(async () => {
    if (!html2canvasRef.current) {
      try {
        const node = await import('html2canvas')
        html2canvasRef.current = node.default
      } catch (e: any) {
        console.warn(e)
        setError('Error importing html2canvas dependency')
      }
    }
    try {
      if (domElement) {
        const canvas = html2canvasRef.current(domElement)
        return canvas
      } else {
        console.warn('DOM element to use in html2canvas')
      }
    } catch (e: any) {
      console.warn(e)
      throw e
    }
  }, [domElement])

  const resetPreviewImage = useCallback(() => {
    setPreviewImage('')
  }, [])

  const generatePreviewImage = useCallback(async () => {
    try {
      setPreviewImageLoading(true)
      const canvas = await getCanvas()
      setPreviewImage(canvas.toDataURL())
      setPreviewImageLoading(false)
    } catch (e: any) {
      setPreviewImageLoading(false)
    }
  }, [getCanvas])

  const downloadImage = useCallback(
    async (fileName = `GFW-fishingmap-${new Date().toLocaleString()}.png`) => {
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
        } catch (e: any) {
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

  return {
    loading,
    error,
    finished,
    downloadImage,
    getCanvas,
    previewImage,
    resetPreviewImage,
    generatePreviewImage,
    previewImageLoading,
  }
}
