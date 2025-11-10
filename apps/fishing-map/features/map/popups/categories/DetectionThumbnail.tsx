/* eslint-disable @next/next/no-img-element */
import { Fragment, useRef } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { PATH_BASENAME } from 'data/config'
import { selectDebugOptions } from 'features/debug/debug.slice'

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

// TODO: remove once Blue Planet is filmed
const STATIC_IMAGES_IDS = [
  'S2A_MSIL1C_20210624T090601_N0300_R050_T33LUJ_20210624T111404;13.26274000;-10.335143',
  'S2A_MSIL1C_20220120T091311_N0301_R050_T32KQG_20220120T125659;11.49717400;-16.506056',
  'S2A_MSIL1C_20220219T091021_N0400_R050_T32KQG_20220219T130439;11.47108500;-16.640775',
  'S2A_MSIL1C_20220301T090921_N0400_R050_T32KQG_20220301T112043;11.49575900;-16.490627',
  'S2B_MSIL1C_20210629T090559_N0300_R050_T33LUJ_20210629T111619;13.31383300;-10.273214',
  'S2B_MSIL1C_20220115T091229_N0301_R050_T32LQH_20220115T112045;11.56826500;-16.258248',
  'S2B_MSIL1C_20220224T090849_N0400_R050_T32KQG_20220224T125809;11.54805300;-16.537597',
  'S2B_MSIL1C_20220306T090739_N0400_R050_T32LQH_20220306T125824;11.58339400;-16.134772',
  'S2B_MSIL1C_20220415T090549_N0400_R050_T32LQH_20220415T115751;11.69872600;-16.232692',
  'S2B_MSIL1C_20220415T090549_N0400_R050_T32LQH_20220415T115751;11.69901100;-16.233049',
  'S2B_MSIL1C_20220505T090549_N0400_R050_T32KQG_20220505T111557;11.53843200;-16.858454',
  'S2B_MSIL1C_20230619T090559_N0509_R050_T32KQG_20230619T111236;11.53373400;-16.372476',
]

export function DetectionThumbnail({ id, data, scale }: DetectionThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const bluePlanetMode = useSelector(selectDebugOptions)?.bluePlanetMode
  if (bluePlanetMode && STATIC_IMAGES_IDS.some((staticId) => id.startsWith(staticId))) {
    return (
      <div className={cx(styles.imgContainer)}>
        <img
          className={styles.staticImg}
          src={`${PATH_BASENAME}/images/blue-planet/${id.replace('_RGB', '')}`}
          alt="detection thumbnail"
        />
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
    )
  }

  const draw = (e: React.SyntheticEvent<HTMLImageElement>) => {
    drawEnhancedImageToCanvas({
      img: e.currentTarget,
      canvas: canvasRef.current,
    })
  }
  return (
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
          <div className={styles.scaleLine} style={{ width: `${SCALE_LINE_WIDTH_PERCENTAGE}%` }} />
        </Fragment>
      )}
    </div>
  )
}

export default DetectionThumbnail
