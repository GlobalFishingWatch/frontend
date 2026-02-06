/* eslint-disable @next/next/no-img-element */
import { Fragment, useRef } from 'react'
import cx from 'classnames'

import { handleOpenImage } from 'utils/img'

import styles from './DetectionThumbnail.module.css'

type DetectionThumbnailProps = {
  id: string
  data: string
  scale?: number
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
}: {
  img: HTMLImageElement
  canvas?: HTMLCanvasElement | null
}) => {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Draw the image to canvas first to get the image data
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  // Apply histogram stretching
  const stretchedData = stretchHistogram(imageData.data, 0.1)

  // Create new ImageData with stretched values
  const newImageData = new ImageData(stretchedData as any, canvas.width, canvas.height)
  ctx.putImageData(newImageData, 0, 0)
}

export function DetectionThumbnail({ data, scale }: DetectionThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const draw = (e: React.SyntheticEvent<HTMLImageElement>) => {
    drawEnhancedImageToCanvas({
      img: e.currentTarget,
      canvas: canvasRef.current,
    })
  }
  return (
    <a
      href={`data:${data}`}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => handleOpenImage(e, `data:${data}`)}
    >
      <div className={cx(styles.imgContainer)}>
        <img
          ref={imgRef}
          className={styles.img}
          onLoad={draw}
          src={`data:${data}`}
          alt="detection thumbnail"
        />
        <canvas ref={canvasRef} className={styles.canvas} width={100} height={100} />
        {scale !== undefined && (
          <Fragment>
            <span className={styles.scaleValue}>
              {(scale * 100) / (100 / SCALE_LINE_WIDTH_PERCENTAGE)} m
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
