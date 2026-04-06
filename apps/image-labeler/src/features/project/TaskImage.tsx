import { Fragment, useEffect, useMemo, useRef } from 'react'
import cx from 'classnames'
import { Jimp } from 'jimp'
import * as UPNG from 'upng-js'

import { useLocalStorage } from '@globalfishingwatch/react-hooks'

import styles from './TaskImage.module.css'

type TaskImageProps = {
  thumbnail: string
  scale?: number
  open: boolean
  imageStyle?: React.CSSProperties
}

const SCALE_LINE_WIDTH_PERCENTAGE = 10

const drawEnhancedImageToCanvas = async ({
  img,
  canvas,
  src,
}: {
  img: HTMLImageElement
  canvas?: HTMLCanvasElement | null
  src: string
}) => {
  if (!canvas) return
  // set canvas size based on image
  canvas.width = img.width
  canvas.height = img.height

  // draw in image to canvas
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return
  ctx.drawImage(img, 0, 0)

  const image = await Jimp.read(src)
  image.normalize()
  const imageData = new ImageData(
    new Uint8ClampedArray(image.bitmap.data),
    image.bitmap.width,
    image.bitmap.height
  )
  ctx.putImageData(imageData, 0, 0)
}

const drawOriginalImageToCanvas = async ({
  img,
  canvas,
  src,
}: {
  img: HTMLImageElement
  canvas?: HTMLCanvasElement | null
  src: string
}) => {
  if (!canvas) return
  // set canvas size based on image
  canvas.width = img.width
  canvas.height = img.height

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Check if 16-bit PNG
  const base64 = src.split(',')[1]
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  const bitDepth = bytes[24]

  try {
    if (bitDepth === 16) {
      const png = UPNG.decode(bytes.buffer)
      const { width, height, ctype, depth } = png
      const data = new Uint8ClampedArray(width * height * 4)

      // UPNG.data might be an ArrayBuffer or a Uint8Array depending on the platform/build
      const pngData = png.data as any
      const view = pngData.buffer
        ? new DataView(pngData.buffer, pngData.byteOffset, pngData.byteLength)
        : new DataView(pngData)

      // ctype: 0=Gray, 2=RGB, 3=Palette, 4=GrayA, 6=RGBA
      const numChannels = ctype === 0 ? 1 : ctype === 2 ? 3 : ctype === 4 ? 2 : ctype === 6 ? 4 : 1

      for (let i = 0; i < width * height; i++) {
        let r = 0,
          g = 0,
          b = 0,
          a = 255
        const pixelOffset = i * numChannels * 2

        if (ctype === 0 || ctype === 4) {
          const val = view.getUint16(pixelOffset, false)
          r = g = b = Math.min(255, (val / 15000) * 255)
          if (ctype === 4) {
            a = view.getUint16(pixelOffset + 2, false) / 256
          }
        } else if (ctype === 2 || ctype === 6) {
          r = Math.min(255, (view.getUint16(pixelOffset, false) / 15000) * 255)
          g = Math.min(255, (view.getUint16(pixelOffset + 2, false) / 15000) * 255)
          b = Math.min(255, (view.getUint16(pixelOffset + 4, false) / 15000) * 255)
          if (ctype === 6) {
            a = view.getUint16(pixelOffset + 6, false) / 256
          }
        }

        const idx = i * 4
        data[idx] = r
        data[idx + 1] = g
        data[idx + 2] = b
        data[idx + 3] = a
      }
      const imageData = new ImageData(data, width, height)
      ctx.putImageData(imageData, 0, 0)
    } else {
      ctx.drawImage(img, 0, 0)
    }
  } catch (error) {
    console.error('Error drawing original image to canvas:', error)
    ctx.drawImage(img, 0, 0)
  }
}

export function TaskImage({ thumbnail, scale, open, imageStyle }: TaskImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const originalCanvasRef = useRef<HTMLCanvasElement>(null)
  const [showEnhancedImage] = useLocalStorage('showEnhancedImage', true)
  const canvasWidth = useMemo(() => canvasRef.current?.width, [canvasRef.current])

  useEffect(() => {
    const draw = () => {
      drawOriginalImageToCanvas({
        img,
        canvas: originalCanvasRef.current,
        src: `data:${thumbnail}`,
      })
      drawEnhancedImageToCanvas({
        img,
        canvas: canvasRef.current,
        src: `data:${thumbnail}`,
      })
    }
    const img = new Image()
    img.addEventListener('load', draw)
    img.src = `data:${thumbnail}`
    return () => {
      img.removeEventListener('load', draw)
    }
  }, [thumbnail])

  return (
    <div className={cx(styles.imgContainer)}>
      <canvas
        className={styles.img}
        ref={originalCanvasRef}
        style={{ ...imageStyle, visibility: showEnhancedImage ? 'hidden' : 'visible' }}
      />
      <canvas
        className={styles.img}
        ref={canvasRef}
        style={{ ...imageStyle, visibility: showEnhancedImage ? 'visible' : 'hidden' }}
      />

      {open && scale !== undefined && canvasWidth !== undefined && (
        <Fragment>
          <span className={styles.scaleValue}>
            {(scale * canvasWidth) / (canvasWidth / SCALE_LINE_WIDTH_PERCENTAGE)} m
          </span>
          <div className={styles.scaleLine} style={{ width: `${SCALE_LINE_WIDTH_PERCENTAGE}%` }} />
        </Fragment>
      )}
    </div>
  )
}

export default TaskImage
