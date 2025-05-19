/* eslint-disable @next/next/no-img-element */
import { Fragment, useRef } from 'react'
import cx from 'classnames'

import styles from './DetectionThumbnail.module.css'

type DetectionThumbnailProps = {
  data: string
  scale?: number
}

const SCALE_LINE_WIDTH_PERCENTAGE = 10

const drawEnhancedImageToCanvas = async ({
  img,
  canvas,
}: {
  img: HTMLImageElement
  canvas?: HTMLCanvasElement | null
}) => {
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  const Jimp = await import('jimp').then((module) => module.Jimp)
  const image = await Jimp.read(img.src)
  image.normalize()
  const imageData = new ImageData(
    new Uint8ClampedArray(image.bitmap.data),
    image.bitmap.width,
    image.bitmap.height
  )
  ctx?.putImageData(imageData, 0, 0)
}

export function DetectionThumbnail({ data, scale }: DetectionThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const draw = async (e: React.SyntheticEvent<HTMLImageElement>) => {
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
