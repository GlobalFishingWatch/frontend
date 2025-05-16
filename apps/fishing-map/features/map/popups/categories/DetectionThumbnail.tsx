import { Fragment, useRef } from 'react'
import cx from 'classnames'
import { Jimp } from 'jimp'

import styles from './DetectionThumbnail.module.css'

type DetectionThumbnailProps = {
  url: string
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
  if (!ctx) return
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  const image = await Jimp.read(
    ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer as ArrayBuffer
  )
  image.normalize()
  const imageData = new ImageData(
    new Uint8ClampedArray(image.bitmap.data),
    image.bitmap.width,
    image.bitmap.height
  )
  ctx.putImageData(imageData, 0, 0)
}

export function DetectionThumbnail({ url, scale }: DetectionThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const draw = async (e: React.SyntheticEvent<HTMLImageElement>) => {
    drawEnhancedImageToCanvas({
      img: e.currentTarget,
      canvas: canvasRef.current,
    })
  }
  // useEffect(() => {
  //   imgRef.current?.addEventListener('load', draw)

  //   return () => {
  //     imgRef.current?.removeEventListener('load', draw)
  //   }
  // }, [url])

  return (
    <div className={cx(styles.imgContainer)}>
      <img ref={imgRef} className={styles.img} onLoad={draw} src={url} alt="detection thumbnail" />
      <canvas ref={canvasRef} className={styles.canvas} />
      {scale !== undefined && canvasRef.current?.width !== undefined && (
        <Fragment>
          <span className={styles.scaleValue}>
            {(scale * canvasRef.current?.width) /
              (canvasRef.current?.width / SCALE_LINE_WIDTH_PERCENTAGE)}{' '}
            m
          </span>
          <div className={styles.scaleLine} style={{ width: `${SCALE_LINE_WIDTH_PERCENTAGE}%` }} />
        </Fragment>
      )}
    </div>
  )
}

export default DetectionThumbnail
