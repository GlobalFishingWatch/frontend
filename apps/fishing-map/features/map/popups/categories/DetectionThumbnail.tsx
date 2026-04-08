/* eslint-disable @next/next/no-img-element */
import { Fragment, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { decode } from 'upng-js'

import { handleOpenImage } from 'utils/img'

import styles from './DetectionThumbnail.module.css'

type DetectionThumbnailProps = {
  id: string
  data: string
  scale?: number
  datasetId?: string
}

const SCALE_LINE_WIDTH_PERCENTAGE = 10

const stretchHistogram = (imageData: Uint8ClampedArray, p: number = 0.1): Uint8ClampedArray => {
  // Convert to array of pixel values (excluding alpha channel)
  const pixelValues: number[] = []
  for (let i = 0; i < imageData.length; i += 4) {
    // Use average of RGB channels for percentile calculation
    const avg = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3
    pixelValues.push(avg)
  }

  // Sort values for percentile calculation
  pixelValues.sort((a, b) => a - b)

  // Calculate percentiles
  const pPercentile = p / 100
  const p1Index = Math.floor(pixelValues.length * pPercentile)
  const p2Index = Math.floor(pixelValues.length * (1 - pPercentile))
  const p1 = pixelValues[p1Index]
  const p2 = pixelValues[p2Index]

  // Calculate exposure adjustment parameters
  const range = p2 - p1
  const exposureScale = 255 / range
  const exposureOffset = -p1 * exposureScale

  // Apply exposure adjustment to each RGB channel
  const stretchedData = new Uint8ClampedArray(imageData.length)

  for (let i = 0; i < imageData.length; i += 4) {
    // Apply exposure adjustment to each RGB channel
    for (let j = 0; j < 3; j++) {
      const value = imageData[i + j]
      // Rescale exposure: newValue = (originalValue * scale) + offset
      const exposed = value * exposureScale + exposureOffset
      const clamped = Math.max(0, Math.min(255, exposed))
      stretchedData[i + j] = Math.round(clamped)
    }
    // Preserve alpha channel
    stretchedData[i + 3] = imageData[i + 3]
  }

  return stretchedData
}

const drawEnhancedImageToCanvas = ({
  img,
  canvas,
  src,
}: {
  img: HTMLImageElement
  canvas?: HTMLCanvasElement | null
  src: string
}) => {
  if (!canvas) return
  const originalWidth = canvas.width
  const originalHeight = canvas.height
  canvas.width = img.width || originalWidth
  canvas.height = img.height || originalHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const base64 = src.split(',')[1]
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  const bitDepth = bytes[24]

  try {
    if (bitDepth === 16) {
      const png = decode(bytes.buffer)
      const { width, height, ctype } = png
      const data = new Uint8ClampedArray(width * height * 4)

      canvas.width = width
      canvas.height = height

      const pngData = png.data as any
      const view = pngData.buffer
        ? new DataView(pngData.buffer, pngData.byteOffset, pngData.byteLength)
        : new DataView(pngData)

      const numChannels = ctype === 0 ? 1 : ctype === 2 ? 3 : ctype === 4 ? 2 : ctype === 6 ? 4 : 1

      let minVal = 65535
      let maxVal = 0

      for (let i = 0; i < width * height; i++) {
        const pixelOffset = i * numChannels * 2
        if (ctype === 0 || ctype === 4) {
          const val = view.getUint16(pixelOffset, false)
          if (val < minVal) minVal = val
          if (val > maxVal) maxVal = val
        } else if (ctype === 2 || ctype === 6) {
          const rVal = view.getUint16(pixelOffset, false)
          const gVal = view.getUint16(pixelOffset + 2, false)
          const bVal = view.getUint16(pixelOffset + 4, false)
          minVal = Math.min(minVal, rVal, gVal, bVal)
          maxVal = Math.max(maxVal, rVal, gVal, bVal)
        }
      }

      let stretchMin = minVal
      let stretchMax = maxVal
      const range = maxVal - minVal
      const threshold = 0.1 * 65535

      if (range < threshold) {
        const center = (minVal + maxVal) / 2
        const halfWidth = 0.05 * 65535
        stretchMin = center - halfWidth
        stretchMax = center + halfWidth
      }

      const stretchRange = stretchMax - stretchMin || 1

      for (let i = 0; i < width * height; i++) {
        let r = 0,
          g = 0,
          b = 0,
          a = 255
        const pixelOffset = i * numChannels * 2

        if (ctype === 0 || ctype === 4) {
          const val = view.getUint16(pixelOffset, false)
          r = g = b = Math.min(255, Math.max(0, ((val - stretchMin) / stretchRange) * 255))
          if (ctype === 4) {
            a = view.getUint16(pixelOffset + 2, false) / 256
          }
        } else if (ctype === 2 || ctype === 6) {
          r = Math.min(
            255,
            Math.max(0, ((view.getUint16(pixelOffset, false) - stretchMin) / stretchRange) * 255)
          )
          g = Math.min(
            255,
            Math.max(
              0,
              ((view.getUint16(pixelOffset + 2, false) - stretchMin) / stretchRange) * 255
            )
          )
          b = Math.min(
            255,
            Math.max(
              0,
              ((view.getUint16(pixelOffset + 4, false) - stretchMin) / stretchRange) * 255
            )
          )
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
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const stretchedData = stretchHistogram(imageData.data, 0.1)
      const newImageData = new ImageData(stretchedData as any, canvas.width, canvas.height)
      ctx.putImageData(newImageData, 0, 0)
    }
  } catch (error) {
    console.error('Error drawing enhanced image to canvas:', error)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const stretchedData = stretchHistogram(imageData.data, 0.1)
    const newImageData = new ImageData(stretchedData as any, canvas.width, canvas.height)
    ctx.putImageData(newImageData, 0, 0)
  }
}

export function DetectionThumbnail({ data, scale, datasetId }: DetectionThumbnailProps) {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const thumbnailSize = datasetId === 'private-global-planet-presence:v4.0' ? 200 : 100

  const draw = (e: React.SyntheticEvent<HTMLImageElement>) => {
    drawEnhancedImageToCanvas({
      img: e.currentTarget,
      canvas: canvasRef.current,
      src: `data:${data}`,
    })
  }
  return (
    <a
      href={`data:${data}`}
      target="_blank"
      rel="noreferrer"
      onClick={(e) =>
        handleOpenImage(e, {
          data: canvasRef.current?.toDataURL() as string,
          title: t((t) => t.common.detection),
          type: 'detection',
        })
      }
    >
      <div className={cx(styles.imgContainer)}>
        <img
          ref={imgRef}
          className={styles.img}
          onLoad={draw}
          src={`data:${data}`}
          alt="detection thumbnail"
        />
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={thumbnailSize}
          height={thumbnailSize}
        />
        {scale !== undefined && (
          <Fragment>
            <span className={styles.scaleValue}>
              {(scale * thumbnailSize) / (100 / SCALE_LINE_WIDTH_PERCENTAGE)} m
            </span>
            <div
              className={styles.scaleLine}
              style={{ width: `${SCALE_LINE_WIDTH_PERCENTAGE}%` }}
            />
          </Fragment>
        )}
      </div>
    </a>
  )
}

export default DetectionThumbnail
